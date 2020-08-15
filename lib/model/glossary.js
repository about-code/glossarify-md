const {toReproducablePath} = require("../path/tools");

class Glossary {

    /**
     * @param {Partial<Glossary>} data
     */
    constructor (data) {

        /** @type {string} */
        this.title    = data.title    || "";

        /** @type {string} */
        this.file     = data.file     || "";

        /** @type {VFile} */
        this.vFile    = data.vFile    || null;

        /** @type {string} */
        this.termHint = data.termHint || "";

        /** @type {string} */
        this.basePath = data.basePath || "";

        /** @type {string} */
        this.outPath  = data.outPath  || "";

        /** @type {string} "asc" or "desc" or "". Default: "" */
        this.sort     = data.sort     || "";
    }

    /**
     * @private
     */
    toJSON() {
        return {
            file: this.file
            ,termHint: this.termHint
            ,basePath: toReproducablePath(this.basePath, "/{CWD}")
            ,outPath:  toReproducablePath(this.outPath,  "/{CWD}")
        };
    }
}

module.exports.Glossary = Glossary;
