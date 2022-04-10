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
        this.conf = conf;

        conf.baseDir = toForwardSlash(conf.baseDir || "");
        conf.outDir  = toForwardSlash(conf.outDir  || "");

        if (conf.unified.rcPath) {
            conf.unified.rcPath = toForwardSlash(path.resolve(conf.baseDir, conf.unified.rcPath));
        }

        // Excluding certain headingDepths in (cross-)linking
        conf.indexing.headingDepths = arrayToMap(conf.indexing.headingDepths);
        conf.linking.headingDepths  = arrayToMap(conf.linking.headingDepths);
        conf.linking.limitByTermOrigin = arrayToMap(conf.linking.limitByTermOrigin);
        conf.linking.pathRewrites = reverseMultiValueMap(conf.linking.pathRewrites);

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

/**
 * Transforms a map
 * {
 *    "key1": ["value1", "value2", "value3"],
 *    "key2": ["value1", "valueA", "valueB"],
 *    "key3": "value%"
 * }
 * to a map
 * {
 *    "value1": "key2",
 *    "value2": "key",
 *    "value3": "key",
 *    "valueA": "key2",
 *    "valueB": "key2",
 *    "value%": "key3"
 * }
 */
function reverseMultiValueMap(input) {
    const output = {};
    for (const key in input) {
        // use .concat() to wrap value% into [ "value%" ] prior to forEach()
        if (input[key]) {
            [].concat(input[key]).forEach(value => output[value] = key);
        }
    }
    return output;
}

async function unglobGlossaries(context) {
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

    // 'glossaries' entries in the user-provided conf may include entries where
    // 'file' is a glob. Since a glob can match multiple files at once we
    // calculate a 'glossaries' entry set, here, with globs resolved to individual
    // files. The result will be a 'glossaries' array similar to when a user
    // had written its entries one by one for each file rather than using a glob.
    const promises = glossaries.map(async (glossConf, idx) => {
        const { file: globPattern, import: withImport } = glossConf;
        if (! globPattern) {
            return [];
        }
        if (withImport && globPattern.match(/[*|{}()]/g)) {
            console.error(
                `⚠ Config "glossaries": [{ "file": "${globPattern}", "import": ... }]`
                + "\nattempts to import terms and write multiple files at once using a glob pattern."
                + "\nWon't import terms and handle files matched by pattern as regular glossary files."
            );
            glossConf.import = undefined;
        }

        const files = await new Promise((resolve, reject) => {
            glob(globPattern, globOpts, (err, files) => {
                err ? reject(err): resolve(files);
            });
        });
        const numFiles = files.length;
        let glossConfsPerFile = new Array(numFiles);
        if (numFiles === 0 && glossConf.import) {
            // glossConf describes a glossary to be imported from JSON
            // where a 'glossaries[].file' (Markdown) does not yet exist
            // and therefore can't be found by a glob pattern.
            glossConfsPerFile = [{ ...glossConf, arrIdx: idx }];
        } else {
            for (let i = 0; i < numFiles; i++) {
                const file = relativeFromTo(baseDir, files[i]);
                glossConfsPerFile[i] = { ...glossConf, file, arrIdx: idx };
            }
        }
        return glossConfsPerFile;
    });
    const confsPerFile = await Promise.all(promises);
    const confsAll = confsPerFile.reduce((prev, curr) => [...prev, ...curr], []);

    // In configurations with multiple conf.glossaries[] entries, people
    // may write globs which result in a fileset overlap. The previous
    // reduce() step therefore may produced an array where two glossary
    // confs have been created for a single file. Here we implement a
    // UNIQUE operator on the fileset to eventually have one conf only.
    // In terms of options like 'termHints', 'export', only one wins.
    const keys = {};
    const result = confsAll
        .sort((c1, c2) =>  {
            const byPos = c2.arrIdx - c1.arrIdx; // by position
            return byPos === 0
                ? c1.file.localeCompare(c2.file, "en")
                : byPos;
        })
        .filter(conf => {
            const filePath = conf.file;
            if (! filePath) {
                return true;
            } else if (keys[filePath]) {
                return false;
            } else {
                keys[filePath] = true;
                return true;
            }
        })
        .map(conf => new Glossary(conf));

    context.conf.glossaries = result;
    return context;

}
