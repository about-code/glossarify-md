const uVisit = require("unist-util-visit");
const {getLinkUrl} = require("./ast/tools");

const api = {};

/**
 * Unified plug-in to count occurrences and mentions of a term.
 * Won't count occurrences in the terms own definition.
 */
api.counter = function() {
    return (tree, vFile) => {
        uVisit(tree, "term-occurrence", (node) => {
            node.termDefs.forEach(indexEntry => {
                const termNode = indexEntry.node;
                if (vFile.path === termNode.glossary.vFile.path) {
                    // current file is the glossary in which the term has been
                    // defined...
                    if (getLinkUrl(node.headingNode) !== termNode.anchor) {
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
