export class TermOccurrence {

    /**
     * @param {Partial<TermOccurrenceNode>} data
     */
    constructor(data) {

        /** @type {Node} */
        this.headingNode = null;

        /** @type {Node[]} */
        this.termDefs = [];

        /** @type {string} */
        this.value = "";

        /** @type {Node[]} */
        this.children = [];
        Object.assign(this, data);
    }
}
