/**
 * @typedef {import('./export-type-term')} TermExport
 */
export class ExportTypeGlossary {
    constructor(data) {
        this["@context"] = data["@context"];
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
ExportTypeGlossary.SKOS_MAPPING = {
    "@id": "skos:ConceptScheme"
    ,"@context": {
        "title": "dc:title"
        ,"terms": { "@container": "@index" }
    }
};
