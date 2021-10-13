export class Glossary {

    /**
     * @param {Partial<Glossary>} data
     */
    constructor (data) {

        /** @type {string} */
        this.uri      = data.uri      || "";

        /** @type {string} */
        this.title    = data.title    || "";

        /** @type {string} */
        this.file     = data.file     || "./glossary.md";

        /** @type {VFile} */
        this.exports  = [
            ...data.exports || []
            ,...[data.export].filter(v => !!v).map(v => { return {"file": v }; })
        ];

        /** @type {string} */
        this.termHint = data.termHint || "";

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
        };
    }
}
