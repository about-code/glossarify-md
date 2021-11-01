import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";
import { VFile } from "vfile";
import { ExportTypeGlossary } from "./model/export-type-glossary.js";
import { readJsonFile } from "./path/tools.js";

const jsonLdModuleLoaded = import("jsonld")
    .then(module => module.default)
    .then(jsonld => {
        jsonld.documentLoader = (url) => {
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
        return jsonld;
    })
    .catch(() => {
        return null;
    });


const SKOS = "http://www.w3.org/2004/02/skos/core#";
const DC = "http://purl.org/dc/terms/";
const SkosConceptSchemeType = {
    uri: `${SKOS}ConceptScheme`
    ,title: `${DC}title`
};
const SkosConceptType = {
    uri: `${SKOS}Concept`
    ,prefLabel: `${SKOS}prefLabel`
    ,altLabels: `${SKOS}altLabel`
    ,definition: `${SKOS}definition`
    ,abstract: `${DC}abstract`
};

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

            const jsonImportFile    = importConf.file    || "";
            const jsonldContextFile = importConf.context || "";
            return readJsonFile(jsonImportFile, baseDir)
                .then(importedObj => parseJsonLd(importedObj, jsonldContextFile, jsonImportFile, baseDir))
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
                        console.error(`${jsonImportFile}: ${err.message}`);
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
 * Parses the given JSON string.
 * Uses plain JSON.parse() by default to deserialize JSON import data.
 * Without 'jsonld' available it expects the data to align with glossarify-md's
 * import format.
 *
 * If installed uses 'jsonld' to map JSON object onto a graph and interpret the
 * JavaScript object using SKOS vocabulary. This enables to read other SKOS
 * JSON-LD data formats. Installing jsonld is supposed to be done by users who
 * wanto to import other SKOS-JSON formats with LD-Mappings.
 */
function parseJsonLd(importData, jsonldContextFile, jsonImportFile, baseDir) {
    return jsonLdModuleLoaded
        .then(jsonldModule => {
            if (! jsonldModule) {
                throw "☛ Optional npm package 'jsonld' not installed."
                + " SKOS vocabulary support not available when importing terms"
                + " from JSON.\n";
            }
            if (jsonldContextFile) {
                return readJsonFile(jsonldContextFile, baseDir)
                    .then(jsonldObj => {
                        // Merge external JSON-LD context provided via config
                        // into imported JSON data. Note that imported JSON data
                        // might already embed a JSON-LD context.
                        const externalContext = jsonldObj["@context"];
                        let embeddedContext = importData["@context"];
                        if (Array.isArray(embeddedContext)) {
                            console.info(
                                "☛ Imported file provides a JSON-LD embedded context array."
                                + ` Adding external context at '${jsonldContextFile}'`
                                + " provided via 'conf.glossaries.import.context'.\n"
                            );
                            if (Array.isArray(externalContext)) {
                                embeddedContext = [
                                    ...embeddedContext
                                    ,...externalContext
                                ];
                            } else {
                                embeddedContext.push(externalContext);
                            }
                            importData["@context"] = embeddedContext;
                        } else if (embeddedContext) {
                            console.info(
                                "☛ Imported file declares a JSON-LD context. It will be"
                                + ` overwritten by the external context at '${jsonldContextFile}'`
                                + " provided via 'conf.glossaries.import.context'.\n"
                            );
                            importData["@context"] = externalContext;
                        } else {
                            importData["@context"] = externalContext;
                        }
                        return importData;
                    })
                    .then(importData => {
                        return jsonldModule.flatten(importData, null);
                    });
            } else if (importData["@context"]) {
                // Embedded context
                return jsonldModule.flatten(importData, null);
            } else {
                throw `☛ Note: assuming "${jsonImportFile}" to have a glossarify-md document format (no JSON-LD @context mapping found).`;
                // Skip further JSON-LD processing.
            }
        })
        .then(flattened => flattened["@graph"] || flattened || [])
        .then(ldNodes => skosToGlossaryObj(ldNodes))
        .catch(err => {
            console.error(err);
            return importData;
        });
}

function skosToGlossaryObj(ldNodes) {
    const conceptScheme = ldNodes
        .find(ldNode => ldValue(ldNode["@type"]) === SkosConceptSchemeType.uri);

    const glossaryObj = new ExportTypeGlossary({
        // Map skos:ConceptScheme onto our 'Glossary' import format type
        type: "Glossary"
        ,uri: ldValue(conceptScheme["@id"])
        ,title: ldValue(conceptScheme[SkosConceptSchemeType.title])
        ,terms: {}
    });

    const termsObj = ldNodes
        .filter(ldNode => ldValue(ldNode["@type"]) === SkosConceptType.uri)
        .reduce((terms, conceptInstance) => {
            // Map skos:Concept onto our 'Term' import format type
            let aliases = ldValue(conceptInstance[SkosConceptType.altLabels]) || [];
            if (aliases && !Array.isArray(aliases)) {
                aliases = [aliases];
            }
            const termUri = ldValue(conceptInstance["@id"]);
            const term = {
                type: "Term"
                ,uri: termUri
                ,label: ldValue(conceptInstance[SkosConceptType.prefLabel])
                ,definition: ldValue(conceptInstance[SkosConceptType.definition])
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
