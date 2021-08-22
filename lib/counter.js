const uVisit = require("unist-util-visit");
const {getNodeId} = require("./ast/tools");
const {TermOccurrenceNode} = require("./ast/with/term-occurrence");
const api = {};

/**
 * Unified plug-in to count occurrences and mentions of a term.
 * Won't count occurrences in the terms own definition.
 */
api.counter = function() {
    return (tree, vFile) => {
        const filter = (node) => node.type === TermOccurrenceNode.type;
        uVisit(tree, filter, (node) => {
            node.termDefs.forEach(termNode => {
                if (vFile.path === termNode.glossary.vFile.path) {
                    // current file is the glossary in which the term has been
                    // defined...
                    const headingId = getNodeId(node.headingNode);
                    if (headingId && `#${headingId}` !== termNode.anchor) {
                        // ...count term occurence only, if it is not in the
                        // terms own definition.
                        termNode.countOccurrence();
                    }
                } else {
                    termNode.countOccurrence();
                }
            });
        });
        return tree;
    };
};

module.exports = api;
