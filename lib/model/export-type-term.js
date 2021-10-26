export class ExportTypeTerm {
    /**
     *
     * @param {Partial<ExportTypeTerm>} data
     */
    constructor(data) {
        this.type = "Term";
        this.uri = data.uri;
        this.label = data.label;
        this.definition = data.definition;
        this.abstract = data.abstract;
        this.aliases = data.aliases;
    }
}
ExportTypeTerm.SKOS_MAPPING = {
    "@id": "skos:Concept"
    ,"@context": {
        "label": "skos:prefLabel"
        ,"definition": "skos:definition"
        ,"abstract": "dc:abstract"
        ,"aliases": {
            "@id": "skos:altLabel"
            ,"@container": "@set"
        }
    }
};
