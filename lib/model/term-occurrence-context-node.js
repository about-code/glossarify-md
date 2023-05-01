/**
 * @typedef {import('unist').Parent} Node
 * @typedef {import('../ast/with/term-occurrence-node').TermOccurrenceNode} TermOccurrenceNode
 */


const SYMBOL = "term-occurrence-node";

/**
 * A tree of TermOccurrenceContextNodes and TermOccurrenceNodes where
 * each TermOccurrenceContextNode represents a semantic context (or an
 * assumption of such a context) in which a "cohesive" (somehow related)
 * terminology exists. That terminology is comprised of the terms that
 * can be found in the search space which is considered to capture that
 * context as much as possible. Terms can be added as leaf nodes.
 *
 * The tree will support solving the task of linking to the most appropriate
 * term definition in a given semantic context when there are multiple
 * definitionsfor that term (disambiguation).
 *
 * A simple assumption of a semantic context with a cohesive terminology
 * would be to assume that individual chapters and sections of a book are
 * loosly related semantic contexts where each chapter focuses on a particular
 * topic and uses a cohesive terminology to explain that topic. Even if
 * a term may have different meanings in *a book* it is fair to assume
 * that it may have *a particular meaning* in *a chapter*. To link to the
 * proper definition of that particular meaning we can try to find out
 * which glossary defines most of the terminology used in the chapter.
 *
 * More elaborate but computationally expensive assumptions could try to
 * correlate wording in the environment of a term occurrence with wording
 * used in term definitions. The terminological context of a term
 * occurrence were the environment evaluated as part of such a correlation.
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
