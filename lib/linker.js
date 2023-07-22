import { html, link, text } from "mdast-builder";
import { SKIP, visit } from "unist-util-visit";
import { FileNode } from "./ast/with/file-node.js";
import { TermDefinitionNode } from "./ast/with/term-definition-node.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence-node.js";
import { TermOccurrenceContextNode } from "./ast/with/term-occurrence-context-node.js";
import { resolveGlossaryUrl } from "./path/tools.js";

const REGEXP_SORT_ALTERNATIVES_BY_REFCOUNT = /^glossary-refCount-per-(section|file)/;

/**
 * @typedef {import("./model/context")} Context
 * @typedef {import('unist').Parent} Node
 * @typedef {import('mdast').Paragraph} ParagraphNode
 * @typedef {import('mdast').Heading} HeadingNode
 * @typedef {import('mdast').Link} LinkNode
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import("unist-util-visit").VisitorResult} VisitorResult
 */

/**
 * Factory which creates a unified-engine plug-in (= function) to be
 * passed to the engine's use() function. The plug-in returns an AST
 * tree visitor which visits TermOccurrenceNodes and adds Link node
 * children with links to the glossary section where the terms have
 * been defined.
 *
 * @private
 * @param {Context} context
 */
export function withLinker(context) {

    return () => {
        return (tree, vFile) => {
            visit(tree, FileNode.type, (fileNode) => {
                visit(fileNode.metaTree, getTermOccurrenceVisitor(context, vFile));
            });
            return tree;
        };
    };
}

/**
 * Revisits all TermOccurrenceNodes created in the first linkify phase
 * and appends the actual link nodes to refer to a term definition. When
 * there are multiple term definitions link node creation is affected by
 * config option `linking.limitByAlternatives` and link node order is
 * determined by an algorithm selected with option `linking.sortAlternatives`.
 *
 * @param {Context} context
 * @param {VFile} vFile
 * @param {{[key: string]: number}} glossaryStats
 * @returns { VisitorResult }
 */
function getTermOccurrenceVisitor(context, vFile) {
    const { limitByAlternatives, sortAlternatives } = context.conf.linking;
    const sortAlternativesMethod = sortAlternatives.by;
    let histogram = {};
    return (node) => {
        if (node.type === TermOccurrenceContextNode.type) {
            histogram = node.histogram;
        } else if (node.type === TermOccurrenceNode.type) {
            const sortFn = getSortByRefCount(node, histogram, sortAlternativesMethod);
            linkify(node, sortFn, limitByAlternatives, context, vFile);
            return SKIP;
        }
    };
}

function getSortByRefCount(node, histogram, sortAlternativesMethod) {
    let validDefinitionNodes = node.termDefs;
    const countAmbiguousDefs = validDefinitionNodes.length - 1
        , hasAmbiguousDefs = countAmbiguousDefs > 0;


    if (hasAmbiguousDefs && REGEXP_SORT_ALTERNATIVES_BY_REFCOUNT.test(sortAlternativesMethod)) {
        return (termDef1, termDef2) => {
            const glossaryRefCount1 = histogram[termDef1.file] || 0;
            const glossaryRefCount2 = histogram[termDef2.file] || 0;
            if (glossaryRefCount1 > glossaryRefCount2) {
                return -1;
            } else if (glossaryRefCount1 < glossaryRefCount2) {
                return 1;
            } else {
                return 0;
            }
        };
    } else {
        return TermDefinitionNode.compare;
    }
}

function linkify(node, sortFn, limitByAlternatives, context, vFile) {
    const termDefinitionNodes = node.termDefs.sort(sortFn)
        , countAmbiguousDefs = termDefinitionNodes.length - 1
        , hasAmbiguousDefs = countAmbiguousDefs > 0
        , permittedMaxAmbiguousDefs = Math.abs(limitByAlternatives)
        , hasMoreAmbiguousDefs = countAmbiguousDefs > permittedMaxAmbiguousDefs;

    let linkText = node.value;

    // __/ Config option linking.sortAlternatives.by = "glossary-refCount*" \__
    // In case of an ambiguous term sort its definitions such that the
    // definition from the glossary comes first whose terms have been mentioned
    // the most.
    const primaryDefinitionNode = termDefinitionNodes[0];


    // ____________/ Config option glossaries[i].hint \_____________
    // Omit termHint if there are multiple definitions
    if (! hasAmbiguousDefs && primaryDefinitionNode.hint) {
        if (/\$\{term\}/.test(primaryDefinitionNode.hint)) {
            linkText = primaryDefinitionNode.hint.replace("${term}", linkText);
        } else {
            linkText += primaryDefinitionNode.hint;
        }
    }

    // ________/ Config option linking.limitByAlternatives \________
    // Link all definitions at term occurrence by adding additional
    // links to alternative definitions but limit their number when the user
    // configured an upper limit.
    let linkNodes = [];
    if (hasAmbiguousDefs && permittedMaxAmbiguousDefs > 0) {
        linkNodes = termDefinitionNodes
            .slice(1, 1 + permittedMaxAmbiguousDefs)
            .filter(tNode => tNode !== primaryDefinitionNode)
            .map((tNode, j) => {
                const shortDesc = tNode.getShortDescription();
                const glossUrl = resolveGlossaryUrl(context, vFile, tNode);
                return link(glossUrl, shortDesc,
                    html(j === 0 ? `<sup>${j+2})</sup>` : `<sup> ${j+2})</sup>`)
                );
            });
        if (hasMoreAmbiguousDefs) {
            linkNodes.push(html("<sup>...</sup>"));
        }
    }
    if (node.children.length === 0) {
        node.children = [
            link(
                resolveGlossaryUrl(context, vFile, primaryDefinitionNode)
                ,primaryDefinitionNode.getShortDescription()
                ,text(linkText)
            )
            ,...linkNodes
        ];
    }
}

