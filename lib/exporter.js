import { readFileSync } from "fs";
import path from "node:path";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { TermDefinitionNode } from "./ast/with/term-definition.js";
import { SkosExportLdContext } from "./model/export-mapping-skos.js";
import { ExportTypeGlossary } from "./model/export-type-glossary.js";
import { ExportTypeTerm } from "./model/export-type-term.js";

const jsonLdModuleLoaded = import("jsonld")
    .then(module => module.default)
    .catch(() => null); // Prevent uncought promise.

const MAX_EXPORTS = 10;
export function exporter(context) {
    const { exportFiles, conf } = context;
    const { baseDir, i18n, linking } = conf;
    const filter = (node) => {
        return node.type === TermDefinitionNode.type && linking.headingDepths[node.headingDepth];
    };

    return (tree, vFile) => {
        if (vFile.isGlossary !== true) {
            return;
        }
        const { uri, title, exports: exportConfs } = vFile.glossConf;
        if (! exportConfs || ! Array.isArray(exportConfs) || exportConfs.length === 0) {
            return;
        }

        const promises = exportConfs.slice(0, MAX_EXPORTS).map(exportConf => {
            const exportPath = exportConf.file;
            let exportVFile = exportFiles[exportPath];
            let exportData;
            if (! exportVFile) {
                // File to write exported outputs to has not yet been created
                // from a previous exportConf;
                exportVFile = exportFiles[exportPath] = new VFile({ path: exportPath });
                exportData = new ExportTypeGlossary({
                    "@context": getLDContext(baseDir, i18n.locale, exportConf.context)
                    ,type: "Glossary"
                    ,uri: uri
                    ,title: title
                    ,language: i18n.locale
                    ,terms: {}
                });
                context.writeFiles.push(exportVFile);
            } else {
                exportData = exportVFile.data;
            }

            // Visit term definition AST nodes and add to export data.
            visit(tree, filter, (node) => {
                const termUri = node.uri;
                exportData.terms[termUri] = new ExportTypeTerm({
                    type: "Term"
                    ,uri: termUri
                    ,label: node.value
                    ,definition: node.longDesc
                    ,abstract: node.shortDesc
                    ,aliases: [... node.aliases ]
                });
            });

            exportVFile.data = exportData;

            // Serialize export data
            if (exportVFile.extname.match(/^\.(json|jsonld)$/)) {
                exportVFile.value = JSON.stringify(exportData, null, 2);
                return Promise.resolve();
            } else if (exportVFile.extname.match(/^\.nq$/)) {
                return exportNquads(uri, exportData, exportVFile);
            } else {
                exportVFile.value = "";
                console.error(`⚠ Can't export file "${exportPath}". Supported file types and extensions: '.json', '.jsonld' or '.nq'.`);
                return Promise.resolve();
            }
        });

        return Promise.all(promises);
    };
}

function exportNquads(vocabularyUri, exportData, exportVFile) {
    return jsonLdModuleLoaded
        .then(jsonldModule => {
            const exportPath = exportVFile.path;
            if (jsonldModule) {
                if (!vocabularyUri) {
                    throw `⚠ Can't write glossary to "${exportPath}". RDF N-Quads require a vocabulary URI. See "uri" config option for glossaries.\n`;
                }
                // see https://json-ld.github.io/rdf-dataset-canonicalization/spec/
                return jsonldModule.canonize(exportData, {
                    algorithm: "URDNA2015"
                    ,format: "application/n-quads"
                });
            } else {
                throw `JSON-LD not installed. Can't export glossary as RDF file "${exportPath}" (N-Quads notation).`;
            }
        })
        .then(nquads => exportVFile.value = nquads)
        .catch(err => {
            exportVFile.value = "";
            console.error(err);
        });
}

function getLDContext(baseDir = "", locale = "", fileOrUrl = "") {
    let ldContext = SkosExportLdContext;
    if (fileOrUrl.match(/^https:\/\//)) {
        ldContext = `${fileOrUrl}`;
    } else if (fileOrUrl) {
        try {
            const document = JSON.parse(readFileSync(path.resolve(baseDir, fileOrUrl)));
            ldContext = document["@context"];
        } catch (err) {
            console.error(`✗ Reading from: ${fileOrUrl}: Failed to load (see config 'glossaries.exports.context').\n`);
        }
    }

    const type = Object.prototype.toString.call(ldContext);
    if (type === "[object Object]") {
        ldContext["@language"] = locale;
    } else if (type === "[object Array]") {
        ldContext.unshift({ "@language": locale });
    }
    return ldContext;
}
