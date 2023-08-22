import { SKIP, visit } from "unist-util-visit";
import { Histogram } from "./model/histogram.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence-node.js";

/**
 * Factory which creates a unified-engine plug-in (= function) to be
 * passed to the engine's use() function. The plug-in visits term
 * occurrences and sorts term definitions for each term occurrence
 * based on an analysis of glossary term usage within the section
 * of a term occurrence (potentially including subsections). It
 * improves context-sensitive disambiguation and linking when there
 * are multiple glossaries with competing definitions. It does so by
 * by sorting term definitions of term occurrences according to the
 * popularity of glossaries within the section of the term occurrence.
 *
 * See also config option `sortAlternatives.by` and option value
 * "glossary-ref-count" for additional details.
 */
export function withSortAlternativesByRefCount(context) {

    const sortAlternatives = context.conf.linking.sortAlternatives;
    const sortAlternativesMethod = sortAlternatives.by;

    if (sortAlternativesMethod !== "glossary-ref-count") {
        return (tree) => tree;
    } else {
        const refCountEvalScope = sortAlternatives.perSectionDepth;
        return () => (tree) => {

            const keyFn = (termDefinitionNode) => termDefinitionNode.file;
            const histogramsRoot = new Histogram({ keyFn, depth: 0, parent: null, data: [] });
            const stack = [histogramsRoot];

            // 1. Analyze AST
            visit(tree, ["heading", TermOccurrenceNode.type], (node) => {
                if (node.type === "heading" && node.depth <= refCountEvalScope) {
                    growHistogramTree(stack, node);
                } else if (node.type === TermOccurrenceNode.type) {
                    const histogram = stack[0];
                    const termDefinitionNodes = node.termDefs;
                    termDefinitionNodes.forEach(node => histogram.nextSample(node));
                    histogram.data.push(node);
                }
                return SKIP;
            });

            // 2. Sort term definitions based on term usage in a section
            visit(histogramsRoot, [Histogram.type], (histogram) => {
                const termOccurrences = histogram.data;
                const termDefinitionHashtable = {};
                const refCounts = histogram.getHistogramState().buckets;

                for (let i = 0, len = termOccurrences.length; i < len; i++) {
                    const termOccurrenceNode = termOccurrences[i];
                    const termDefinitions = termOccurrenceNode.termDefs;
                    const termHash = termOccurrenceNode.valueHash8;
                    const termDefinitionsSorted = termDefinitionHashtable[termHash];
                    if (! termDefinitionsSorted) { // [1]
                        termDefinitions.sort((termDef1, termDef2) => {
                            const bucketKey1 = keyFn(termDef1);
                            const bucketKey2 = keyFn(termDef2);
                            return refCounts[bucketKey2] - refCounts[bucketKey1];
                        });
                        termDefinitionHashtable[termHash] = termDefinitions;
                    } else {
                        termOccurrenceNode.termDefs = [ ...termDefinitionsSorted ];
                    }
                }
            });
            return tree;

            // Implementation Notes:
            // [1]: Make all term occurrences associated with the same histogram
            //      use the same term definition order. This way we need to sort
            //      only once per term and evaluation scope rather than once per
            //      term occurrence.
        };
    }
}

/**
 *
 * @param {Histogram[]} stack
 * @param {HeadingNode} headingNode
 * @param {number} index
 * @returns {Histogram[]} stack
 */
function growHistogramTree(stack, headingNode) {
    const keyFn = (termDefinitionNode) => termDefinitionNode.file;
    const depth = headingNode.depth;

    if (stack[0].depth < depth) {
        // Put new parent on the stack
        const parent = stack[0];
        stack.unshift(new Histogram({ keyFn, depth, parent, data: [] }));
    } else {
        // Put deep levels from the stack and put new parent on the stack.
        while (stack[0].depth >= depth) {
            // Given a stack:
            //
            // # Section Depth 1
            // ## Section Depth 2
            // ### Section Depth 3
            // #### Section Depth 4
            // ## Section Depth 2    <=== when visitor is here...
            //
            // ...pop histogram levels 4,3,2 off the stack and make histogram for
            // sections at depth 2 direct children of histograms for sections at
            // depth 1.
            stack.shift();
        }
        const parent = stack[0];
        stack.unshift(new Histogram({ keyFn, depth, parent, data: [] })); // Put on the stack
    }
    return stack;
}
