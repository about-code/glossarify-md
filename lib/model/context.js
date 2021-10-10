import path from "path";
import { toForwardSlash } from "../path/tools.js";
import { Glossary } from "./glossary.js";

/**
 * Test
 *
 * @typedef {import("./glossary")} Glossary
 */
export class Context {

    constructor(conf) {

        /**
         * Files to write to outDir after processing.
         * @type {VFile}
         */
        this.writeFiles = [];

        this.conf = conf;

        conf.baseDir = toForwardSlash(conf.baseDir || "");
        conf.outDir  = toForwardSlash(conf.outDir  || "");
        conf.glossaries = conf.glossaries.map(conf => new Glossary(conf));

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
