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
