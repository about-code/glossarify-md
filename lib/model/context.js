const path = require("path");
const {Glossary} = require("./glossary");
const {toForwardSlash} = require("../path/tools");

/**
 * @typedef {import("./glossary")} Glossary
 */
class Context {

    constructor(conf) {

        /** @type {VFile} */
        this.vFiles = [];

        this.conf = conf;

        conf.baseDir = toForwardSlash(conf.baseDir || "");
        conf.outDir  = toForwardSlash(conf.outDir || "");
        conf.glossaries = conf.glossaries.map(conf => new Glossary(conf));
        conf.linking.headingDepths = conf.linking.headingDepths.reduce((prev, curr) => {
            prev[curr] = true;
            return prev;
        }, {});
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

module.exports.Context = Context;
