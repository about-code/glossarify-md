import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";
import { VFile } from "vfile";
import { DublinCore } from "./model/dublin-core.js";
import { SkosExportLdContext } from "./model/export-mapping-skos.js";
import { ExportTypeGlossary } from "./model/export-type-glossary.js";
import { SKOS } from "./model/skos.js";
import { readJsonFile, readTextFile } from "./path/tools.js";

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
export function importGlossaries(context) {
    const {baseDir, glossaries} = context.conf;
    return Promise
        .all(glossaries.map(glossConf => {
            const { file, showUris, import: importConf } = glossConf;
            if (! (importConf && file)) {
                return Promise.resolve();
            }

            const jsonldContextFile = importConf.context || "";
            const importFile = importConf.file    || "";
            const importContentTypes = [
                "application/json"
                ,"application/ld+json"
                ,"application/n-quads"
                ,"text/plain"
            ];
            return readTextFile(importFile, baseDir, importContentTypes)
                .then(({content, contentType}) => {
                    return parse(content, contentType, baseDir, jsonldContextFile, importFile);
                })
                .then(glossaryObj => {
                    try {
                        const vFile = new VFile({
                            path: file
                            ,value: json2md(glossaryObj, { showUris })
                        });
                        glossConf.uri = glossaryObj.uri;
                        glossConf.title = glossaryObj.title;
                        glossConf.vFile = vFile;
                        context.writeFiles.push(vFile);
                    } catch (err) {
                        console.error(`${importFile}: ${err.message}`);
                        throw err;
                    }
                });
        }))
        .then(() => context)
        .catch(err => {
            console.error(err);
            return context;
        });
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
 * @param {object} jsonldDocFile Filename of user-configured external context
 * @param {string} jsonImportFile Name of the file that is being processed (log messages)
 */
function parse(content, contentType, baseDir, jsonldDocFile, jsonImportFile) {

    function _parseStringToObject(jsonldModule) {
        if (! jsonldModule) {
            throw "☛ Optional npm package 'jsonld' not installed."
            + " SKOS vocabulary support not available for importing terms.\n";
        }
        if (contentType === "application/n-quads") {
            return jsonldModule
                .fromRDF(`${content}`, { format: contentType })
                .then(importObject => {
                    return { importObject, jsonldModule};
                });
        } else {
            // assume JSON string to parse.
            return { importObject: JSON.parse(content), jsonldModule };
        }
    }

    function _setLdContext({ importObject, jsonldModule }) {
        if (jsonldDocFile) {
            // ...user configured to use an external JSON-LD context file
            return readJsonFile(jsonldDocFile, baseDir)
                .then(jsonldDoc => setExternalLdContext(importObject, jsonldDoc, jsonldDocFile))
                .then(importObject => {
                    return { importObject, jsonldModule };
                });
        } else if (importObject["@context"]) {
            // ... imported data embeds a JSON-LD context
            return Promise.resolve({ importObject, jsonldModule });
        } else {
            // ... no JSON-LD context. Fall back to use own SKOS mapping context.
            console.log(`☛ Note: No JSON-LD @context mapping found. Assuming "${jsonImportFile}" to comply with glossarify-md's export data model.`);
            importObject["@context"] = SkosExportLdContext;
            return Promise.resolve({ importObject, jsonldModule });
        }
    }

    return jsonldModuleLoaded
        .then(_parseStringToObject)
        .then(_setLdContext)
        .then(({importObject, jsonldModule}) => jsonldModule.flatten(importObject, null))
        .then(flattened => flattened["@graph"] || flattened || [])
        .then(ldNodes => skosToGlossaryObj(ldNodes))
        .catch(err => {
            console.error(err);
            if (err.moduleNotFound === true) {
                // Assume file to import has glossarify-md export document format...
                return JSON.parse(content);
            } else {
                throw err;
            }
        });
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
    const externalContext = ldContextDoc["@context"];
    let embeddedContext = doc["@context"];
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
        doc["@context"] = embeddedContext;
    } else if (embeddedContext) {
        console.info(
            "☛ Imported file declares a JSON-LD context. It will be"
            + ` overwritten by an external context at '${ldContextDocFile}'`
            + " (provided via config 'glossaries.import.context').\n"
        );
        doc["@context"] = externalContext;
    } else {
        doc["@context"] = externalContext;
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
function skosToGlossaryObj(ldNodes) {
    const conceptScheme = ldNodes
        .find(ldNode => ldValue(ldNode["@type"]) === SKOS.ConceptScheme);

    const glossaryObj = new ExportTypeGlossary({
        // Map skos:ConceptScheme onto our 'Glossary' import format type
        type: "Glossary"
        ,uri: ldValue(conceptScheme["@id"])
        ,title: ldValue(conceptScheme[DublinCore.title])
        ,terms: {}
    });

    const termsObj = ldNodes
        .filter(ldNode => ldValue(ldNode["@type"]) === SKOS.Concept)
        .reduce((terms, conceptInstance) => {
            // Map skos:Concept onto our 'Term' import format type
            let aliases = ldValue(conceptInstance[SKOS.altLabels]) || [];
            if (aliases && !Array.isArray(aliases)) {
                aliases = [aliases];
            }
            const termUri = ldValue(conceptInstance["@id"]);
            const term = {
                type: "Term"
                ,uri: termUri
                ,label: ldValue(conceptInstance[SKOS.prefLabel])
                ,definition: ldValue(conceptInstance[SKOS.definition])
                ,aliases: aliases
            };
            terms[termUri] = term;
            return terms;
        }, {});

    glossaryObj.terms = termsObj;
    return glossaryObj;
}


function ldValue(v) {
    if (Array.isArray(v)) {
        if (v.length >= 1) {
            if (v[0] && typeof v[0] === "object") {
                return v[0]["@value"];
            } else {
                return v[0];
            }
        }
    } else if (v && typeof v === "object") {
        return v["@value"];
    } else {
        return v;
    }
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
    return function (prev, uri) {
        // Potentially unsafe values
        let {
            label = ""
            ,definition = ""
            ,aliases = []
        } = terms[uri];

        // Strip potentially dangerous markdown and HTML.
        label = sanitize(label);
        definition = sanitize(definition);
        let attrs = JSON.stringify({
            uri: sanitize(uri) || undefined
            ,aliases: sanitize(aliases.join(", ")) || undefined
        }, null, 2);

        const termAttrs = `<!--${attrs}-->`;
        const showUri = showUris
            ? `\n\n${ showUris === true ? uri : showUris.replace("${uri}", uri) }`
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
