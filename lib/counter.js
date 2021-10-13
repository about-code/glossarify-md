import { visit } from "unist-util-visit";
import { getNodeId } from "./ast/tools.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence.js";

/**
 * Unified plug-in to count occurrences and mentions of a term.
 * Won't count occurrences in the terms own definition.
 */
export function counter() {
    const filter = node => node.type === TermOccurrenceNode.type;
    return (tree, vFile) => {
        visit(tree, filter, (node) => {
            node.termDefs.forEach(termNode => {
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
            });
        });
        return tree;
    };
}
