import { readFile } from "node:fs";
import path from "node:path";
import { VFile } from "vfile";

const SKOS = "http://www.w3.org/2004/02/skos/core#";
const SKOS_= "skos";
const DC = "http://purl.org/dc/terms/";
const DC_= "dc";
const LD_CONTEXT = {
    [SKOS_]: SKOS
    ,[DC_]: DC
};
const SkosConceptSchemeType = {
    uri: `${SKOS_}:ConceptScheme`
    ,title: `${DC_}:title`
};
const SkosConceptType = {
    uri: `${SKOS_}:Concept`
    ,prefLabel: `${SKOS_}:prefLabel`
    ,altLabels: `${SKOS_}:altLabel`
    ,definition: `${SKOS_}:definition`
    ,abstract: `${DC_}:abstract`
};
/**
 * @typedef {import("./model/context.js").Context } Context
 *
 * @param {Context} context
 */
export function importGlossaries(context) {
    const {baseDir, glossaries} = context.conf;
    return Promise.all(glossaries.map(g => {
        const importConf = g.import;
        if (! (importConf && g.file)) {
            return Promise.resolve();
        } else if (g.file.match(/[*|{}()]/g)) {
            console.error(
                `⚠ Config "glossaries": [{ "file": "${g.file}", "import": ... }]:`
                + "\nAttempts to write imported terms to multiple files using a glob."
                + "\nNot supported. Skipping import."
            );
            g.import = undefined;
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const jsonFileName = importConf.file;
            const jsonFile = path.resolve(baseDir, jsonFileName);
            readFile(jsonFile, (err, jsonStr) => {
                if (err) {
                    reject(err);
                }
                jsonParse(jsonStr).then(jsonData => {
                    try {
                        const vFile = new VFile({
                            path: g.file
                            ,value: json2md(jsonData)
                        });
                        g.uri = jsonData.uri;
                        g.title = jsonData.title;
                        g.vFile = vFile;
                        context.writeFiles.push(vFile);
                        resolve();
                    } catch (parseErr) {
                        console.error(`${jsonFileName}: ${err.message}`);
                        reject(parseErr);
                    }
                });
            });
        });
    })).then(() => context);
}


function json2md(imported) {
    const terms = imported.terms || {};
    const termsStr = Object
        .keys(terms)
        .reduce(getTermReducer(terms), "");

    const glossaryStr = `# ${imported.title || "Glossary" }\n${termsStr}`;
    return glossaryStr;
}

function getTermReducer(terms) {
    return function (prev, uri) {
        const { value = "", definition = "", aliases = [] } = terms[uri];
        const attrs = {
            uri: uri
            ,aliases: aliases.join(", ") || undefined
        };
        const termAttrs = ["<!--", JSON.stringify(attrs, null, 2), "-->"].join("");
        if (value) {
            const md = prev +
`
## ${value}
${termAttrs}

${definition}
`;
            return md;
        } else {
            return prev;
        }
    };
}

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
function jsonParse(jsonStr) {
    try {
        const jsonData = JSON.parse(jsonStr);
        const glossary = import("jsonld")
            .then(module => module.default)
            .then(jsonld => {
                jsonld.documentLoader = (url) => {
                    console.error(new Error(`${url}:\nLoading external JSON-LD documents not implemented.\n`));
                };
                return jsonld;
            })
            .then(jsonld => jsonld.flatten(jsonData, LD_CONTEXT))
            .then(flattened => flattened["@graph"])
            .then(ldNodes => {
                const conceptScheme = ldNodes.find(ldNode => ldNode["@type"] === SkosConceptSchemeType.uri);
                const glossary = {
                    // Map skos:ConceptScheme onto our 'Glossary' import format type
                    type: "Glossary"
                    ,uri: ldValue(conceptScheme["@id"])
                    ,title: ldValue(conceptScheme[SkosConceptSchemeType.title])
                    ,terms: {}
                };
                ldNodes
                    .filter(ldNode => ldNode["@type"] === SkosConceptType.uri)
                    .forEach(conceptInstance => {
                        // Map skos:Concept onto our 'Term' import format type
                        const terms = glossary.terms;
                        let aliases = ldValue(conceptInstance[SkosConceptType.altLabels]) || [];
                        if (aliases && !Array.isArray(aliases)) {
                            aliases = [aliases];
                        }
                        const termUri = ldValue(conceptInstance["@id"]);
                        const term = {
                            type: "Term"
                            ,uri: termUri
                            ,value: ldValue(conceptInstance[SkosConceptType.prefLabel])
                            ,definition: ldValue(conceptInstance[SkosConceptType.definition])
                            ,aliases: aliases
                        };
                        terms[termUri] = term;
                    });

                return glossary;
            });

        return glossary.catch(() => jsonData);
    } catch (err) {
        Promise.reject(err);
    }
}

function ldValue(v) {
    if (Array.isArray(v)) {
        if (v.length >= 1) {
            return v[0]["@value"];
        }
    } else if (v && typeof v === "object") {
        return v["@value"];
    } else {
        return v;
    }
}
