/**
 * @typedef {import("./glossary")} Glossary
 */

class Context {

    /**
     * @param {{ opts:{[key: string]: any} }} data
     */
    constructor(data) {
        this.opts = data.opts;

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

module.exports.Context = Context;
