import glob from "glob";
import path from "node:path";
import proc from "node:process";
import { relativeFromTo, toForwardSlash } from "../path/tools.js";
import { init as initCollator } from "../text/collator.js";
import { Glossary } from "./glossary.js";


/**
 *
 * @param {*} glossarifyMdConf
 * @returns {Context}
 */
export function newContext(glossarifyMdConf) {
    initCollator(glossarifyMdConf.i18n);
    const context = new Context(glossarifyMdConf);
    return unglobGlossaries(context);
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
        this.exportFiles = {};
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
        proc.chdir(this.conf.baseDir);
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
    const globOpts = {
        cwd: baseDir
        ,ignore: excludeFiles
        ,nodir: true
        ,dot: true
        ,absolute: true
        ,matchBase: true
        ,cache: {}
    };

    const promises = glossaries.map((glossConf, idx) => {
        const {
            file: globPattern,
            import: withImport
        } = glossConf;
        return new Promise((resolve, reject) => {
            if (!globPattern) {
                return resolve([]);
            }
            if (withImport && globPattern.match(/[*|{}()]/g)) {
                console.error(
                    `⚠ Config "glossaries": [{ "file": "${globPattern}", "import": ... }]`
                    + "\nattempts to import terms and write multiple files at once using a glob pattern."
                    + "\nWon't import terms and handle files matched by pattern as regular glossary files."
                );
                glossConf.import = undefined;
            }
            glob(globPattern, globOpts, (err, files) => {
                if (err) {
                    reject(err);
                }
                const numFiles = files.length;
                const result = new Array(numFiles);
                for (let i = 0; i < numFiles; i++) {
                    const file = relativeFromTo(baseDir, files[i]);
                    result[i] = { ...glossConf, file, arrIdx: idx };
                }
                if (numFiles === 0 && glossConf.import) {
                    // glossConf describes a glossary to be imported from JSON
                    // where a 'glossaries[].file' (Markdown) does not yet exist
                    // and therefore can't be found by a glob pattern.
                    result.push({ ...glossConf, arrIdx: idx });
                }
                resolve(result);
            });
        });
    });
    return Promise.all(promises)
        .then(confsPerGlob => confsPerGlob.reduce((prev, curr) => [...prev, ...curr], []))
        .then(confsAll => {
            // In configurations with multiple conf.glossaries[] entries people
            // may write globs which result in a fileset overlap. The previous
            // reduce() step therefore may produced an array where two glossary
            // confs have been created for a single file. Here we implement a
            // UNIQUE operator on the fileset to eventually have one conf only.
            // In terms of options like 'termHints', 'exports', only one wins.
            const keys = {};
            return confsAll
                .sort((c1, c2) =>  {
                    const byPos = c2.arrIdx - c1.arrIdx;
                    return byPos === 0
                        ? c2.file.localeCompare(c1.file, "en")
                        : byPos;
                })
                .filter(conf => {
                    const filePath = conf.file;
                    if (! filePath) {
                        return true;
                    } else if (keys[filePath]) {
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
