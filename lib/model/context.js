import glob from "glob";
import path from "path";
import { relativeFromTo, toForwardSlash } from "../path/tools.js";
import { collator, init as initCollator } from "../text/collator.js";
import { Glossary } from "./glossary.js";

export function newContext(glossarifyMdConf) {
    initCollator(glossarifyMdConf.i18n);
    const context = new Context(glossarifyMdConf);
    // --- DEACTIVATE (TO COMMIT AND TEST SEPARATELY)
    // return unglobGlossaries(context);
    // --- DROP ON ACTIVATION ---
    context.conf.glossaries = glossarifyMdConf.glossaries.map(conf => new Glossary(conf));
    return Promise.resolve(context);
    // --------------------------
}

/**
 * Test
 *
 * @typedef {import("./glossary")} Glossary
 */
class Context {

    constructor(conf) {

        /**
         * Files to write to outDir after processing.
         * @type {VFile}
         */
        this.writeFiles = [];
        this.conf = conf;

        conf.baseDir = toForwardSlash(conf.baseDir || "");
        conf.outDir  = toForwardSlash(conf.outDir  || "");

        if (conf.unified.rcPath) {
            conf.unified.rcPath = toForwardSlash(path.resolve(conf.baseDir, conf.unified.rcPath));
        }

        // Excluding certain headingDepths in (cross-)linking
        conf.indexing.headingDepths = arrayToMap(conf.indexing.headingDepths);
        conf.linking.headingDepths  = arrayToMap(conf.linking.headingDepths);

        // limit link creation for alternative definitions
        const altLinks = conf.linking.limitByAlternatives;
        if (Math.abs(altLinks) > 95) {
            conf.linking.limitByAlternatives = Math.sign(altLinks) * 95;
        }

        if (conf.generateFiles.listOfFigures) {
            conf.generateFiles.listOfFigures = Object.assign({ class: "figure", title: "Figures"}, conf.generateFiles.listOfFigures);
            conf.generateFiles.listOf.push(conf.generateFiles.listOfFigures);
        }
        if (conf.generateFiles.listOfTables) {
            conf.generateFiles.listOfTables = Object.assign({ class: "table", title: "Tables"}, conf.generateFiles.listOfTables);
            conf.generateFiles.listOf.push(conf.generateFiles.listOfTables);
        }
    }

    resolvePath(relativePath) {
        return toForwardSlash(path.resolve(this.conf.baseDir, relativePath));
    }

    setBaseDir(baseDir) {
        this.conf.baseDir = toForwardSlash(baseDir);
    }
}

function arrayToMap(array) {
    return array.reduce((prev, curr) => {
        prev[curr] = true;
        return prev;
    }, {});
}

function unglobGlossaries(context) {
    const { baseDir, glossaries, excludeFiles } = context.conf;
    const promises = [];

    for (let i = 0, len = glossaries.length; i < len; i++) {
        const glossConf = glossaries[i];
        const globPattern = glossConf.file;
        const globOpts = {
            cwd: baseDir
            ,ignore: excludeFiles
            ,nodir: true
            ,dot: true
            ,absolute: true
            ,matchBase: true
            ,cache: {}
        };
        promises.push(new Promise((resolve, reject) => {
            glob(globPattern, globOpts, (err, files) => {
                if (err) {
                    reject(err);
                }
                const numFiles = files.length;
                const result = new Array(numFiles);
                for (let j = 0; j < numFiles; j++) {
                    const file = relativeFromTo(baseDir, files[j]);
                    result[j] = { ...glossConf, file };
                }
                resolve(result);
            });
        }));
    }
    return Promise.all(promises)
        .then(confsPerGlob => confsPerGlob.reduce((prev, curr) => [...prev, ...curr], []))
        .then(confsAll => {
            // In configurations with multiple conf.glossaries[] entries people
            // may write globs which result in a fileset overlap. The previous
            // reduce() step therefore may produced an array where two glossary
            // confs have been created for a single file. Here we implement a
            // UNIQUE operator on the fileset to eventually have one conf only.
            // In terms of options like 'termHints', 'exports', only one wins.
            // We use sorting on file paths to gain predictable and reproducable
            // results.
            const keys = {};
            return confsAll
                .sort((c1, c2) => {
                    const f1 = c1.file;
                    const f2 = c2.file;
                    const len = f1.length - f2.length;
                    return len === 0 ? collator.compare(c1.file, c2.file) : len;
                })
                .filter(conf => {
                    const filePath = conf.file;
                    if (keys[filePath]) {
                        return false;
                    } else {
                        return keys[filePath] = true;
                    }
                })
                .map(conf => new Glossary(conf));
        })
        .then(result => {
            context.conf.glossaries = result;
            return context;
        });
}
