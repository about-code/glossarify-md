/**
 * @typedef {import('unist').Parent} Node
 * @typedef {import('../ast/with/term-occurrence-node').TermOccurrenceNode} TermOccurrenceNode
 */


const SYMBOL = "term-occurrence-node";

/**
 * A tree of TermOccurrenceContextNodes and TermOccurrenceNodes where
 * each TermOccurrenceContextNode is a statistical assumption of some
 * semantically "cohesive" context and TermOccurrenceNodes are leaf
 * nodes being term occurrences found in those contexts. The tree will
 * be used to disambiguate ambiguous terms in a context senstive way
 * and support relevance-based sort criterias for config option
 * `linking.sortAlternatives`.
 *
 * @implements {Node}
 */
export class TermOccurrenceContextNode {

    constructor() {

        /** @type {string} */
        this.type = SYMBOL;

        /**
         * A histogram and term-glossary distribution where key (x-axis) is
         * a glossary and value (y-axis) counts how many times a term of that
         * glossary has been mentioned in a given terminological context
         * window (e.g. a book section). For disambiguation glossaries will
         * be sorted by their count and if there are multiple glossaries which
         * provide a definition for a given term, the count will provide the
         * sort criteria and priortization when choosing the most appropriate
         * definition in the term's context.
         *
         * @type { {[key: string]: number }}
         */
        this.histogram = {};

        /**
         * @type {TermOccurrenceContextNode[] | TermOccurrenceNode[]}
         */
        this.children = [];
    }
}
TermOccurrenceContextNode.type = SYMBOL;
