import { readFileSync } from "fs";
import path from "node:path";
import { VFile } from "vfile";
import { IDX_TERMS } from "./index/terms.js";
import { getIndex } from "./indexer.js";
import { GlossarifyExportSkos } from "./interop/export.js";
import { JsonLd } from "./interop/vocab.js";
import { ExportTypeGlossary } from "./model/export-type-glossary.js";
import { ExportTypeTerm } from "./model/export-type-term.js";

const jsonLdModuleLoaded = import("jsonld")
    .then(module => module.default)
    .catch(() => null); // Prevent uncought promise.

const MAX_EXPORTS = 10;
export async function exportGlossaries(context) {
    const { baseDir, i18n, linking, glossaries } = context.conf;
    const indexedTerms = getIndex(IDX_TERMS)[0] || [];

    // 1. Init Glossaries
    const exportFiles = {};
    const exportFilesArr = [];
    glossaries
        .filter(g => g.exports)
        .map(glossConf => {
            const { uri, title } = glossConf;
            const exportConfs = glossConf.exports.slice(0, MAX_EXPORTS);
            for (let i = 0, len = exportConfs.length; i < len; i++) {
                const exportConf = exportConfs[i];
                const exportPath = exportConf.file;
                let exportVFile = exportFiles[exportPath];
                if (! exportVFile) {
                    exportVFile = exportFiles[exportPath] = new VFile({
                        path: exportPath
                        ,data: { unifiedEngineGiven: true }
                    });
                    exportVFile._data = new ExportTypeGlossary({
                        [JsonLd["@context"]]: getLDContext(baseDir, i18n.locale, exportConf.context)
                        ,uri: uri
                        ,title: title
                        ,language: i18n.locale
                        ,terms: {}
                    });
                    exportFilesArr.push(exportVFile);
                }
            }
        });

    if (glossaries.length === 0 || indexedTerms === 0) {
        // nothing to export;
        return Promise.resolve(context);
    }

    // 2. Add terms to glossaries
    indexedTerms
        .filter(termIndexEntry => {
            const node = termIndexEntry.node;
            return node.glossVFile.glossConf.exports && linking.headingDepths[node.headingDepth];
        })
        .sort((a, b) => a.node.headingId.localeCompare(b.node.headingId, "en"))
        .map(termIndexEntry => {
            const node = termIndexEntry.node;
            const glossVFile = node.glossVFile;
            const glossConf = glossVFile.glossConf;
            const exportConfs = glossConf.exports.slice(0, MAX_EXPORTS);
            const termUri = node.uri;
            const term = new ExportTypeTerm({
                uri: termUri
                ,label: node.value
                ,definition: node.longDesc
                ,abstract: node.shortDesc
                ,aliases: [... node.aliases ]
            });

            for (let i = 0, len = exportConfs.length; i < len; i++) {
                const exportConf = exportConfs[i];
                const exportPath = exportConf.file;
                exportFiles[exportPath]._data.terms[termUri] = term;
            }
        });


    // 3. Serialize glossaries
    const promises = exportFilesArr.map(exportVFile => {
        const exportPath = exportVFile.path;
        const exportData = exportVFile._data;
        const vocabUri = exportData.uri;
        if (exportVFile.extname.match(/^\.(json|jsonld)$/)) {
            exportVFile.value = JSON.stringify(exportData, null, 2);
            context.writeFiles.push(exportVFile);
            return Promise.resolve();
        } else if (exportVFile.extname.match(/^\.nq$/)) {
            context.writeFiles.push(exportVFile);
            return exportNquads(vocabUri, exportData, exportVFile);
        } else {
            exportVFile.value = "";
            console.error(`⚠ Can't export file "${exportPath}". Supported file types and extensions: '.json', '.jsonld' or '.nq'.`);
            return Promise.resolve();
        }
    });

    await Promise.all(promises);
    return context;
}

async function exportNquads(vocabularyUri, exportData, exportVFile) {
    const jsonldModule = await jsonLdModuleLoaded;
    const exportPath = exportVFile.path;

    try {
        if (jsonldModule) {
            if (!vocabularyUri) {
                throw `⚠ Can't write glossary to "${exportPath}". RDF N-Quads require a vocabulary URI. See "uri" config option for glossaries.\n`;
            }
            // see https://json-ld.github.io/rdf-dataset-canonicalization/spec/
            exportVFile.value = await jsonldModule.canonize(exportData, {
                algorithm: "URDNA2015"
                ,format: "application/n-quads"
            });
        } else {
            throw `JSON-LD not installed. Can't export glossary as RDF file "${exportPath}" (N-Quads notation).`;
        }
    } catch (err) {
        exportVFile.value = "";
        console.error(err);
    }
}

function getLDContext(baseDir = "", locale = "", fileOrUrl = "") {
    let ldContext = GlossarifyExportSkos;
    if (fileOrUrl.match(/^https:\/\//)) {
        ldContext = `${fileOrUrl}`;
    } else if (fileOrUrl) {
        try {
            const document = JSON.parse(readFileSync(path.resolve(baseDir, fileOrUrl)));
            ldContext = document[JsonLd["@context"]];
        } catch (err) {
            console.error(`✗ Reading from: ${fileOrUrl}: Failed to load (see config 'glossaries.export.context').\n`);
        }
    }

    const type = Object.prototype.toString.call(ldContext);
    if (type === "[object Object]") {
        ldContext[JsonLd["@language"]] = locale;
    } else if (type === "[object Array]") {
        ldContext.unshift({ [JsonLd["@language"]]: locale });
    }
    return ldContext;
}
