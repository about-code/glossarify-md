import { readFileSync } from "fs";
import path from "node:path";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { TermDefinitionNode } from "./ast/with/term-definition.js";

const MAX_EXPORTS = 10;
const LD_VOCAB = "https://about-code.github.io/vocab/glossarify-md/2021/10/#";
const LD_CONTEXT = {
    "@context": {
        "@vocab": LD_VOCAB
        ,"skos": "http://www.w3.org/2004/02/skos/core#"
        ,"dc": "http://purl.org/dc/terms/"
        ,"uri": "@id"
        ,"type": "@type"
        ,"title": "dc:title"
        ,"terms": {
            "@container": "@index"
            ,"@reverse": "skos:inScheme"
        }
        ,"Glossary": "skos:ConceptScheme"
        ,"Term": {
            "@id": "skos:Concept"
            ,"@context": {
                "label": "skos:prefLabel"
                ,"definition": "skos:definition"
                ,"aliases": {
                    "@id": "skos:altLabel"
                    ,"@container": "@set"
                }
                ,"abstract": "dc:abstract"
            }
        }
    }
};

export function exporter(context) {
    const { exportFiles, conf } = context;
    const { baseDir, i18n, linking } = conf;
    return (tree, vFile) => {
        if (vFile.isGlossary !== true) {
            return;
        }
        const { uri, title, exports: exportConfs } = vFile.glossConf;
        if (! exportConfs || ! Array.isArray(exportConfs) || exportConfs.length === 0) {
            return;
        }

        exportConfs.slice(0, MAX_EXPORTS).forEach(exportConf => {
            const exportPath = exportConf.file;

            let exportData;
            let exportFile = exportFiles[exportPath];
            if (! exportFile) {
                exportFile = exportFiles[exportPath] = new VFile({ path: exportPath });
                context.writeFiles.push(exportFile);
                exportData = {
                    ...getLDContext(baseDir, i18n.locale, exportConf.context)
                    ,type: "Glossary"
                    ,uri: uri
                    ,title: title
                    ,language: i18n.locale
                    ,terms: {}
                };
            } else {
                exportData = exportFile.data;
            }

            const filter = node => node.type === TermDefinitionNode.type && linking.headingDepths[node.headingDepth];
            visit(tree, filter, (node) => {
                const termUri = node.uri;
                exportData.terms[termUri] = {
                    type: "Term"
                    ,uri: termUri
                    ,label: node.value
                    ,definition: node.longDesc
                    ,abstract: node.shortDesc
                    ,aliases: [... node.aliases ]
                };
            });
            exportFile.data = exportData;
            exportFile.value = JSON.stringify(exportData, null, 2);
        });
    };
}

function getLDContext(baseDir = "", locale = "", fileOrUrl = "") {
    let jsonld = LD_CONTEXT;
    if (fileOrUrl.match(/^https:\/\//)) {
        jsonld = { "@context": `${fileOrUrl}` };
    } else if (fileOrUrl) {
        try {
            jsonld = JSON.parse(readFileSync(path.resolve(baseDir, fileOrUrl)));
        } catch (err) {
            console.error(`✗ Reading from: ${fileOrUrl}: Failed to load (see config 'glossaries.exports.context').\n`);
        }
    }

    const ldContext = jsonld["@context"];
    const type = Object.prototype.toString.call(ldContext);
    if (type === "[object Object]") {
        ldContext["@language"] = locale;
    } else if (type === "[object Array]") {
        ldContext.unshift({ "@language": locale });
    }
    return jsonld;
}
