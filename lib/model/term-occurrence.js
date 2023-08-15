/**
 * @typedef {import('mdast').Parent.Node} Node
 * @typedef {import('./term-definition').TermDefinition} TermDefinition
 */

/**
 * @property {Node} headingNode
 * @property {TermDefinition[]} termDefs An ordered set of term definitions provided for a term occurrence. Contains a single element for unambiguous terms but may contain multiple elements for ambiguous terms with multiple definitions. In case of multiple definitions the first element is considered to be the primary term definition for a given term occurrence. The primary definition is the one to be linked by a term occurrence's phrase. Other definitions may or may not be rendered and linkified. The set of term definitions can be sorted individually for each distinct term occurrence depending on algorithms used for context sensitive disambiguation. Therefore distinct occurrences for the same term must not point at the same term definitions array using this property even though the term definitions contained in those sets are identical.
 * @property {string} value The phrase of the term occurrence
 * @property {string} valueHash8 The hash of the phrase which a term occurrence must share with a term definition.
 */
export class TermOccurrence {

    /**
     * @param {Partial<TermOccurrenceNode>} data
     */
    constructor(data) {

        this.headingNode = null;
        this.termDefs = [];
        this.value = "";
        this.valueHash8 = "";

        Object.assign(this, data);
    }

    /**
     * @returns {TermDefinition} The primary definition among term definitions for this term occurrence.
     */
    getPrimaryDefinition() {
        return this.termDefs[0];

        // Implementation Note:
        // A term occurrence having at least a single term definition is a class invariant.
        // Term occurrences without a term definition must be considered a fatal error and
        // invalid system state.
    }
}
