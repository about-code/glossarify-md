import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";
import { VFile } from "vfile";
import { GlossarifyExportSkos } from "./interop/export.js";
import { DcTerms, JsonLd, Skos } from "./interop/vocab.js";
import { ExportTypeGlossary } from "./model/export-type-glossary.js";
import { readJsonFile, readTextFile } from "./path/tools.js";
import { beginsWith } from "./text/tools.js";
import { writeTextFile } from "./writer.js";

const jsonldModuleLoaded = import("jsonld")
    .then(module => module.default)
    .then(jsonldModule => {
        jsonldModule.documentLoader = (url) => {
            console.warn(`Attempt to import a JSON-Document with an external JSON-LD context at '${url}':\n`
            + "Loading external JSON-LD documents from the web is not supported. Your options: \n"
            + "1. Either embed the context document into the file to import\n"
            + "2. Or provide a 'glossaries.import.context' file alongside 'glossaries.import.file'."
            );
            return {
                url: url
                ,document: {}
                ,documentUrl: url
            };
        };
        return jsonldModule;
    })
    .catch((err) => {
        err.moduleNotFound = true;
        return err;
    });

/**
 * @typedef {import("./model/context.js").Context } Context
 *
 * @param {Context} context
 */
export async function importGlossaries(context) {
    const {baseDir, glossaries, i18n} = context.conf;
    const locale = i18n.locale;

    try {
        const promises = glossaries.map(async (glossConf) => {
            const { file, showUris, import: importConf } = glossConf;
            if (! (importConf && file)) {
                return Promise.resolve();
            }
            const acceptContentTypes = {
                "jsonld": "application/ld+json"
                ,"json": "application/json"
                ,"nq": "application/n-quads"
                // ,"csv": "text/csv"
                ,"txt": "text/plain"
            };
            const importExternalContextFile = importConf.context || "";
            const importFile = importConf.file    || "";
            const { content, contentType } = await readTextFile(importFile, baseDir, acceptContentTypes);
            let glossaryObj;
            let jsonImported;
            switch(contentType) {
                case "application/n-quads":  
                    jsonImported = await parseNquadsToJson(content, contentType);
                    glossaryObj  = await parseJsonLd(jsonImported, baseDir, importExternalContextFile, importFile, locale);
                    break;
                // case "text/csv":
                //     jsonImported = await parseCsvToJson(content, baseDir, importExternalContextFile, importFile, locale);
                //     glossaryObj  = await parseJsonLd(jsonImported, baseDir, importExternalContextFile, importFile, locale);
                //     break;
                case "application/ld+json":
                    jsonImported = JSON.parse(content);
                    glossaryObj = await parseJsonLd(jsonImported, baseDir, importExternalContextFile, importFile, locale);
                    break;
                case "application/json":
                case "text/plain":
                    jsonImported = JSON.parse(content);
                    try {
                        // Try parsing JSON-LD even though content type indicates a plain JSON file. 
                        // In case 'jsonld' npm module could not be found or has not been installed
                        // be tolerant, though, and rather assume the plain JSON file matches 
                        // glossarify's own export format terminology, such that no special JSON-LD 
                        // processing is necessary. Import may fail with errors if the assumption doesn't
                        // hold true.
                        glossaryObj = await parseJsonLd(jsonImported, baseDir, importExternalContextFile, importFile, locale);
                    } catch(err) {
                        if (err.moduleNotFound === true) {
                            glossaryObj = jsonImported;
                            console.warn(err);
                        } else {
                            throw err;
                        }
                    }
                    break;
                default: 
                    throw new Error("Unknown content type.");
            }
            
            try {
                const vFile = new VFile({
                    path: file
                    ,value: json2md(glossaryObj, { showUris })
                });
                glossConf.uri = glossaryObj.uri;
                glossConf.title = glossaryObj.title;
                glossConf.vFile = vFile;
                writeTextFile(context, vFile);
            } catch (err) {
                console.error(`${importFile}: ${err.message}`);
                throw err;
            }
        });
        await Promise.all(promises);
        return context;
    } catch (err) {
        console.error(err.message);
        if (err.name && err.name === "jsonld.SyntaxError") {
            console.error(JSON.stringify(err.details.context, null, 2));
        }
        return context;
    }
}

// ============ PARSING ============

/**
 * Attempts to interpret `importData` attributes in terms of SKOS and Dublin
 * Core vocabulary.
 *
 * When installed, uses the [jsonld] npm package to destructure the given JSON
 * import data object into a linked data graph and interpret the graph in terms
 * of SKOS and Dublin Core attribute names. This enables importing terms from
 * other document formats, given these formats provide JSON-LD term mappings
 * onto SKOS and Dublin Core.
 *
 * [jsonld] npm package is supposed to be optional and installed by users.
 * Without [jsonld] available returns the given import data as is.
 *
 * [jsonld]: https://npmjs.com/package/jsonld
 *
 * @param {string} content Data string to parse.
 * @param {string} baseDir Base directory to look for jsonld external context
 * @param {object} jsonldExternalContext Filename of user-configured external context
 * @param {string} jsonImportFile Name of the file that is being processed (log messages)
 * @return {ExportTypeGlossary} Glossary
 */
async function parseJsonLd(jsonDocImported, baseDir, jsonldExternalContext, jsonImportFile, locale) {
    const jsonldModule = await jsonldModuleLoaded;
    if (! jsonldModule) {
        throw "☛ Optional npm package 'jsonld' not found. Assuming import file format matches glossarify-md's export format.\n";
    } else {
        // 1. Augment imported JSON document with @context if not available
        if (jsonldExternalContext) {
            // ...user configured to use an external JSON-LD context file
            const jsonldDoc = await readJsonFile(jsonldExternalContext, baseDir);
            jsonDocImported = await setExternalLdContext(jsonDocImported, jsonldDoc, jsonldExternalContext);
        }
        if (! jsonDocImported[JsonLd["@context"]]) {
            // ... no JSON-LD context. Fall back to use own SKOS mapping context.
            console.log(`☛ Note: No JSON-LD @context mapping found. Assuming "${jsonImportFile}" to comply with glossarify-md's export data model.`);
            jsonDocImported[JsonLd["@context"]] = GlossarifyExportSkos;
        }
        // 2. Apply JSON-LD flattening to get flattened data graph
        const flattened = await jsonldModule.flatten(jsonDocImported, null);
        const ldNodes = flattened[JsonLd["@graph"]] || flattened || [];
        // 3. Map data graph onto glossarify-md model by interpreting SKOS model terms
        const parsed = skosToGlossary(ldNodes, locale);
        return parsed;
    }
}

async function parseNquadsToJson(content, contentType) {
    const jsonldModule = await jsonldModuleLoaded;
    if (! jsonldModule) {
        throw "☛ Optional npm package 'jsonld' not installed."
        + " Cannot import content type application/n-quads.\n";
    } else {
        return await jsonldModule.fromRDF(`${content}`, { format: contentType });
    }
}

/**
 *
 * @param {Object} doc A JSON document (may already have an embedded JSON-LD @context)
 * @param {Object} ldContextDoc A JSON-LD *external context* document to embed into the JSON-Document.
 * @returns
 */
function setExternalLdContext(doc, ldContextDoc, ldContextDocFile) {
    // Merge external JSON-LD context provided via config
    // into imported JSON data. Note that imported JSON data
    // might already embed a JSON-LD context.
    const externalContext = ldContextDoc[JsonLd["@context"]];
    let embeddedContext = doc[JsonLd["@context"]];
    if (Array.isArray(embeddedContext)) {
        console.info(
            "☛ Imported file provides a JSON-LD embedded context array."
            + ` Appending external context at '${ldContextDocFile}'`
            + " (provided via config 'glossaries.import.context').\n"
        );
        if (Array.isArray(externalContext)) {
            embeddedContext = [
                ...embeddedContext
                ,...externalContext
            ];
        } else {
            embeddedContext.push(externalContext);
        }
        doc[JsonLd["@context"]] = embeddedContext;
    } else if (embeddedContext) {
        console.info(
            "☛ Imported file declares a JSON-LD context. It will be"
            + ` overwritten by an external context at '${ldContextDocFile}'`
            + " (provided via config 'glossaries.import.context').\n"
        );
        doc[JsonLd["@context"]] = externalContext;
    } else {
        doc[JsonLd["@context"]] = externalContext;
    }
    return doc;
}

/**
 * Maps SKOS and Dublin Core Linked Data onto glossarify-md's export document
 * format.
 *
 * @param {Array<>} ldNodes Array of flattened JSON-LD nodes in SKOS and Dublin Core terminology
 * @returns {ExportTypeGlossary} Glossary in glossarify-md's export document format
 */
function skosToGlossary(ldNodes, locale) {

    // ldNode values can be multi-valued arrays with a value per locale.
    // this is a helper for accessing the value for the configured locale.
    const _i18n = (ldAttr, ldNode, fallback) => ldValue(ldNode[ldAttr], locale, fallback);
    const conceptScheme = ldNodes.find(n => _i18n(JsonLd["@type"], n, true) === Skos.ConceptScheme) || {};
    const glossaryObj = new ExportTypeGlossary({
        type: "Glossary"
        ,uri:   _i18n(JsonLd["@id"],  conceptScheme)
        ,title: _i18n(Skos.prefLabel, conceptScheme) || _i18n(DcTerms.title, conceptScheme)
        ,terms: {}
    });

    const termsObj = ldNodes
        .filter(ldNode => _i18n(JsonLd["@type"], ldNode) === Skos.Concept)
        .reduce((terms, conceptInstance) => {
            // Map skos:Concept onto our 'Term' import format type
            let aliases = _i18n(Skos.altLabel, conceptInstance, false) || [];
            if (aliases && !Array.isArray(aliases)) {
                aliases = [aliases];
            }
            const termUri = _i18n(JsonLd["@id"], conceptInstance);
            const term = {
                type: "Term"
                ,uri: beginsWith(JsonLd.blank, termUri) ? "" : termUri
                ,label:      _i18n(Skos.prefLabel,  conceptInstance)
                ,definition: _i18n(Skos.definition, conceptInstance)
                ,aliases: aliases
            };
            terms[termUri] = term;
            return terms;
        }, {});

    glossaryObj.terms = termsObj;
    return glossaryObj;
}


/**
 * Returns the value of a JSON-LD Node of a flattened LD graph. The structure in
 * which the actual data value is provided can vary depending on the mapping and
 * flattening algorithm, previously applied.
 *
 * Tries returning a value
 *
 * 1. exactly for the given locale
 * 2. or in the same locale / language
 * 3. or the first value without a locale
 * 4. or, when `fallback == true` the first value found for whatever locale.
 *
 * @param {array|object} v
 * @param {string} locale Default "en"
 * @param {boolean} fallback
 *
 * @returns A scalar value.
 */
function ldValue(v, locale = "en", fallback = true) {
    const val  = JsonLd["@value"];
    const lang = JsonLd["@language"];
    const type = Object.prototype.toString.call(v);
    function valueOf(arr) {
        let items = arr.length;
        if (items === 1) {
            return arr[0];
        } else if (items > 1) {
            return arr;
        }
    }
    if (type === "[object Array]" && v.length >= 1) { // [1]
        const first = v[0];
        if (typeof first === "object" && first !== null) { // [2]
            let result;
            // try find values exactly matching locale and return
            const localizedValObj = v
                .filter(obj => obj[lang] === locale)
                .map(obj => obj[val]);
            result = valueOf(localizedValObj);
            if (result) { return result; }

            // try find values matching language and return
            const altLocaleValObj = v
                .filter(obj => beginsWith(locale, obj[lang]))
                .map(obj => obj[val]);
            result = valueOf(altLocaleValObj);
            if (result) { return result; }

            // try find values with no locale at all and return
            const noLocaleValObj = v
                .filter(obj => !obj[lang])
                .map(obj => obj[val]);
            result = valueOf(noLocaleValObj);
            if (result) { return result; }

            // if a fallback is acceptable fall back to any first value
            if (fallback) {
                return first[val];
            }
        } else {
            return first; // [3]
        }
    } else if (type === "[object Object]") { // [4]
        return v[val];
    } else {
        return v; // [5]
    }
    // Implementation Notes:
    // --------------------------------------------
    // [1]: v may be a multi-valued property....
    // [2]: ... and property values are JSON-LD value objects (e.g. internationalized strings)
    //      [ { "@value": "...", "@language": "fr"},
    //        { "@value": "...", "@language": "de"} ]
    // [3]: v may be a potentially multi-valued property with scalar values
    //      like @type: [...] and will be assumed to have a single value, only,
    //      in imported data.
    // [4]: v is a single-value property with a value object holding the value
    //      The value object might indicate a @language but due to a lack of
    //      alternatives it doesn't matter, here)
    // [5]: v is a single-value property with a scalar value
}

// ============ SERIALIZING (to Markdown) ============

function json2md(imported, opts) {
    const { showUris } = opts;
    const terms = imported.terms || {};
    const termsStr = Object
        .keys(terms)
        .reduce(getTermReducer(terms, showUris), "");

    const glossaryStr = `# ${imported.title || "Glossary" }\n${termsStr}`;
    return glossaryStr;
}


const remarkSanitize = unified()
    .use(remarkParse)
    .use(stripMarkdown)
    .use(remarkStringify);

function sanitize(str) {
    return remarkSanitize
        .processSync(str)
        .toString()
        .trim();
}

function getTermReducer(terms, showUris) {
    return function (prev, key) {
        // Potentially unsafe values
        let { label="", definition="", aliases=[], uri="" } = terms[key];

        // Strip potentially dangerous markdown and HTML
        label = sanitize(label);
        definition = sanitize(definition);
        let attrs = JSON.stringify({
            uri: sanitize(uri) || undefined
            ,aliases: sanitize(aliases.join(", ")) || undefined
        }, null, 2);

        const termAttrs = attrs !== "{}"
            ? `<!--${attrs}-->`
            : "";
        const showUri = showUris
            ? `\n\n${ showUris === true ? key : showUris.replace("${uri}", key) }`
            : "";
        if (label) {
            const md = prev +
`
## ${label}
${termAttrs}
${definition}${showUri}
`;
            return md;
        } else {
            return prev;
        }
    };
}
