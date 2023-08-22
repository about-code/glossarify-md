import { visit } from "unist-util-visit";
import { getNodeId } from "./ast/tools.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence-node.js";

/**
 * Factory which creates a unified-engine plug-in (= function) to be
 * passed to the engine's use() function. The plug-in returns an AST
 * tree visitor for counting occurrences and mentions of a term.
 * Won't count occurrences in the terms own definition.
 */
export function withCounter() {
    const filter = node => node.type === TermOccurrenceNode.type;

    return () => (tree, vFile) => {
        visit(tree, filter, (node) => {
            const termDefs = node.termDefs;
            for (let i = 0, len = termDefs.length; i < len; i++) {
                const termNode = termDefs[i];
                if (vFile.path === termNode.glossVFile.path) {
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
            }
        });
        return tree;
    };
}
