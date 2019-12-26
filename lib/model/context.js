const Dictionary = require("./model/dictionary");
const Glossary = require("./model/glossary");

class Context {

    /**
     * @param {{ opts:{[key: string]: any} }} data
     */
    constructor(data) {
        this.opts = data.opts;
        this.terms = new Dictionary();

        /** @type {VFile} */
        this.vFiles = [];

        /** @type {{ [path: string]: Glossary}} */
        this.glossaries = {};

        /**
         * Resolved absolute base directory path. Use this for processing files
         * since `opts.baseDir` is only the unresolved configuration value.
         */
        this.baseDir = "";

        /**
         * Resolved absolute output directory path. Use this for processing
         * files since `opts.baseDir` is only the unresolved configuration
         * value.
         */
        this.outDir = "";
    }
}

module.exports = Context;
