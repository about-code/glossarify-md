import { JsonLd } from "../interop/vocab-jsonld.js";
/**
 * @typedef {import('./export-type-term')} TermExport
 */
export class ExportTypeGlossary {
    constructor(data) {
        this[JsonLd["@context"]] = data[JsonLd["@context"]];

        this.type = "Glossary";
        this.uri = data.uri;
        this.title = data.title;
        this.language = data.language;

        /**
         * @type {{ [key: string]: TermExport }}
         */
        this.terms = data.terms || {};
    }
}
