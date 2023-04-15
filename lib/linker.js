import { html, link, text } from "mdast-builder";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import { findReplace } from "./ast/find-replace.js";
import { TermDefinitionNode } from "./ast/with/term-definition-node.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence-node.js";
import { IDX_TERMS_BY_ID, IDX_TERMS_BY_PHRASE } from "./index/terms.js";
import { getIndex } from "./indexer.js";
import { classifyRelationshipFromTo, getFileLinkUrl } from "./path/tools.js";
import { getNodeText } from "./ast/tools.js";

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
 * tree visitor for finding occurrences of glossary terms and replacing
 * those terms with links to the glossary section where the terms have
 * been defined.
 *
 * @private
 * @param {Context} context
 */
export function withLinker(context) {

    /**
     * Returns a two-dimentional array of term definitions in alphabetical
     * order where the first dimension represents a term and the second all
     * its definitions in particular glossaries.
     *
     * @param { {key: IndexEntry<TermDefinitionNode>[] }} indexEntriesByPhrase indexed by value (hash)
     * @return { Array<TermDefinitionNodes[]>} Array of Arrays with term definition nodes
     */
    const getTermsSorted = function (indexEntriesByPhrase) {
        return Object
            .keys(indexEntriesByPhrase)
            .map(phrase =>
                indexEntriesByPhrase[phrase]
                    .map(indexEntry => indexEntry.node)
                    .sort((termDefinitionNode1, termDefinitionNode2) => {
                        return TermDefinitionNode.compare(termDefinitionNode1, termDefinitionNode2);
                    })
            );
        // Implementation note:
        // The term instances in 2nd dimension are sorted based on term and glossary
        // path for reproducable results and reliable diff-testing. Otherwise when a
        // term were defined in two glossaries the order of link references in markdown
        // output would be undefined and would vary across platforms and program executions.
        // It's also important to compare by a distinct glossary path rather than
        // just the glossary file name because it's likely there will be projects
        // with multiple glossaries in different folders but all named 'glossary.md'.
    };

    const termIndexEntriesById = getIndex(IDX_TERMS_BY_ID);
    const termIndexEntriesByPhrase = getIndex(IDX_TERMS_BY_PHRASE);
    const termDefinitions2D = getTermsSorted(termIndexEntriesByPhrase);


    return () => {
        /**
         * A histogram of term occurrences for particular glossaries.
         * Contributes statistics for config option linking.sortAlternatives.
         * @type { { key: number }}
         */
        const glossaryStats = {};
        return (tree, vFile) => {
            visit(tree, getLinkifyVisitor(context, vFile, termDefinitions2D, termIndexEntriesById, glossaryStats));
            visit(tree, [TermOccurrenceNode.type], getTermOccurrenceVisitor(context, vFile, glossaryStats));
            return tree;
        };
    };
}

/**
 * @private
 * @param {Context} context
 * @param {VFile} vFile
 * @param {Array<TermDefinitionNode[]>} termDefinitions2D A two-dimensional Array of Arrays where the first dimension represents a term and the second dimension all the term's definitions. With just one glossary each term usually has just one definition and the array at a position termDefinitions2D[i] is typically an array of size one for all terms i. With multiple glossaries and n definitions for a particular term the array at a position termDefinitions2D[i] can be an array of size n for a particular i.
 */
function getLinkifyVisitor(context, vFile, termDefinitions2D, termIndexEntriesById, glossaryStats) {
    let headingNode = null;
    return (node, index, parent) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let term_i = 0, len = termDefinitions2D.length; term_i < len; term_i++) {
                const termDefinitionNodes = termDefinitions2D[term_i];
                findTermOccurrencesByPhrase(node, headingNode, termDefinitionNodes, context, vFile, glossaryStats);
            }
            return CONTINUE; // Skip children. Already been visited by linkifyAst.
        } else if (node.type === "blockquote" || node.type === "html") {
            return SKIP;
        } else if (node.type === "heading") {
            headingNode = node;
            return SKIP;
        } else if (node.type === TermOccurrenceNode.type) {
            return SKIP;
        } else if (node.type === "link") {
            findTermOccurrenceById(node, headingNode, termIndexEntriesById, context, vFile, glossaryStats, index, parent);
            return SKIP;
        } else {
            return CONTINUE;
        }
    };
}

/**
 * Searches for Markdown links `[term](#id)` using just a term's custom heading id
 * and replaces `#id` with a path or URL to the section identified by `#id`.
 * Resolves according to the following rules:
 *
 * 1. Given #custom-heading-id is unique across documents then a path to the
 *    file declaring #custom-heading-id should be prepended (see example below)
 * 2. Given #custom-heading-id is not unique across documents then local
 *    declaration should take precedence over external declaration.
 * 3. Given #custom-heading-id is not unique across documents and there is no
 *    local declaration, either, then it should not be modified.
 *
 * @private
 * @param {LinkNode} node
 * @param {HeadingNode} headingNode
 * @param {[key]: IndexEntry[]} indexEntriesById
 * @param {number} nodeIndex AST index of node
 * @param {Node} nodeParent Parent node
 * @returns {VisitorResult}
 */
function findTermOccurrenceById(node, headingNode, indexEntriesById, context, vFile, glossaryStats, nodeIndex, nodeParent) {
    const headingId = node.url.replace("#", "")
        , termDefinitionIndexEntry = indexEntriesById[headingId];

    if (termDefinitionIndexEntry && termDefinitionIndexEntry.length === 1) {
        const termDefinitionNode = termDefinitionIndexEntry[0].node
            , glossFile = termDefinitionNode.glossVFile.glossConf.file
            , linkText = getNodeText(node)
            , termOccurrenceNode = new TermOccurrenceNode({
                headingNode: headingNode
                ,termDefs:  [termDefinitionNode]
                ,value: linkText
                ,children: [node]
            });

        // anchor is unique (Rule 1)
        node.url = resolveGlossaryUrl(context, vFile, termDefinitionNode);
        node.title = node.title || termDefinitionNode.getShortDescription();

        // Collect stats on terminology use from glossary
        if (glossaryStats[glossFile]) {
            glossaryStats[glossFile] += 1;
        } else {
            glossaryStats[glossFile] = 1;
        }
        nodeParent.children[nodeIndex] = termOccurrenceNode;
    }
    // else:
    //    if there is a local definition, then Rule 2 can be satisifed by doing nothing.
    //    if there is no local declaration then Rule 3 must be satisfied by doing nothing.
}

/**
 * Scans a given paragraph node for occurrences of a particular term. Modifies a paragraph
 * node's subtree such that text nodes with term occurrences will be split into multiple
 * text nodes with a newly term occurrence node being added in between. A term occurrence node
 * forms a subtree of link nodes. At a minimum there is a single link node child linking the
 * term occurrence with a glossary definition. When there are multiple glossaries and multiple
 * alternative definitions of the same term a term occurrence node may has more than one
 * link node children to link alternative definitions, too. The number of link node children
 * can be affected by user config options.
 *
 * @private
 * @param {ParagraphNode} paragraphNode text or paragraph node to search for term occurrence
 * @param {HeadingNode} headingNode the heading node preceding a paragraph node
 * @param {TermDefinitionNode[]} termDefinitionNodes One or more definitions of the term to look for
 * @param {Context} context context object
 * @param {VFile} vFile current markdown document file
 * @param {[key: string]: number} glossaryStats
 * @returns {Node} Modified paragraphNode
 */
function findTermOccurrencesByPhrase(paragraphNode, headingNode, termDefinitionNodes, context, vFile, glossaryStats) {
    let countTermOccurrences = 0;
    const { headingDepths, limitByAlternatives, limitByTermOrigin, mentions } = context.conf.linking;
    const maxTermOccurrencesToLinkify = (mentions === "first-in-paragraph") ? 1 : Infinity
        , permittedHeadingDepths = headingDepths
        , permittedRelationships = limitByTermOrigin
        , permittedMaxAmbiguousDefs = Math.abs(limitByAlternatives)
        , skipOnMaxAmbiguousDefs = Math.sign(limitByAlternatives) < 0
        , validDefinitionNodes = termDefinitionNodes.filter(node =>
            filterByHeadingDepth(node, permittedHeadingDepths) &&
            filterByRelationship(node, permittedRelationships, vFile)
        )
        , countDefinitions = validDefinitionNodes.length
        , countAmbiguousDefs = countDefinitions - 1
        , hasAmbiguousDefs = countAmbiguousDefs > 0
        , hasMaxAmbiguousDefs = countAmbiguousDefs >= permittedMaxAmbiguousDefs
        , termDefinitionNode = validDefinitionNodes[0]
        , termOccurrenceNodeFactory = (linkText) => {
            if (countTermOccurrences >= maxTermOccurrencesToLinkify) {
                return text(linkText);
            } else {
                countTermOccurrences++;
            }
            const termOccurrenceNode = new TermOccurrenceNode({
                headingNode: headingNode
                ,termDefs: validDefinitionNodes
                ,value: linkText
                ,children: []
            });

            // Collect distribution of unambiguous term occurrences over glossaries
            // to assist choosing the most likely glossary definition for a term
            // occurrence when there are multiple ambiguous definitions
            if (!hasAmbiguousDefs) {
                const glossFile = termDefinitionNode.glossVFile.glossConf.file;
                if (glossaryStats[glossFile]) {
                    glossaryStats[glossFile] += 1;
                } else {
                    glossaryStats[glossFile] = 1;
                }
            }
            return termOccurrenceNode;
        }
        ;


    if (! termDefinitionNode) {
        return;
    }
    if (hasMaxAmbiguousDefs && skipOnMaxAmbiguousDefs) {
        return;
    }
    // Return linkified paragraphNode
    return findReplace(paragraphNode, termDefinitionNode.regex, termOccurrenceNodeFactory);
}

function filterByHeadingDepth(node, permittedHeadingDepths) {
    return !!permittedHeadingDepths[node.headingDepth];
}

function filterByRelationship(node, permittedRelationships, vFile) {
    let result = true;
    if (Object.keys(permittedRelationships).length > 0) {
        const rel = classifyRelationshipFromTo(vFile.path, node.glossVFile.path);
        result &= permittedRelationships[rel];
    }
    return result;
}

function getTermOccurrenceVisitor(context, vFile, glossaryStats) {
    const { limitByAlternatives, sortAlternatives } = context.conf.linking;

    return (termOccurrenceNode) => {
        let validDefinitionNodes = termOccurrenceNode.termDefs;
        const countAmbiguousDefs = validDefinitionNodes.length - 1
            , hasAmbiguousDefs = countAmbiguousDefs > 0
            , permittedMaxAmbiguousDefs = Math.abs(limitByAlternatives)
            , hasMoreAmbiguousDefs = countAmbiguousDefs > permittedMaxAmbiguousDefs
            ;
        let linkText = termOccurrenceNode.value;


        // __/ Config option linking.sortAlternatives = "by-terminology-in-file" \__
        // In case of an ambiguous term sort its definitions such that the
        // definition from the glossary comes first whose (unambiguous) terms
        // have been mentioned the most in a file. This assumes to find the
        // best contextual fit by the teminology used in a file.
        if (hasAmbiguousDefs && sortAlternatives === "by-terminology-in-file") {
            validDefinitionNodes = validDefinitionNodes.sort((termDef1, termDef2) => {
                const glossaryTermsFound1 = glossaryStats[termDef1.glossVFile.glossConf.file] || 0;
                const glossaryTermsFound2 = glossaryStats[termDef2.glossVFile.glossConf.file] || 0;
                if (glossaryTermsFound1 > glossaryTermsFound2) {
                    return -1;
                } else if (glossaryTermsFound1 < glossaryTermsFound2) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        const termDefinitionNode = validDefinitionNodes[0];


        // ____________/ Config option glossaries[i].hint \_____________
        // Omit termHint if there are multiple definitions
        if (! hasAmbiguousDefs && termDefinitionNode.hint) {
            if (/\$\{term\}/.test(termDefinitionNode.hint)) {
                linkText = termDefinitionNode.hint.replace("${term}", linkText);
            } else {
                linkText += termDefinitionNode.hint;
            }
        }

        // ________/ Config option linking.limitByAlternatives \________
        // Link all definitions at a term occurrence by adding additional
        // links as superscript but limit their number when the user
        // configured an upper limit.
        let linkNodes = [];
        if (hasAmbiguousDefs && permittedMaxAmbiguousDefs > 0) {
            linkNodes = validDefinitionNodes
                .filter((node, count) => {
                    return node !== termDefinitionNode
                        && count > 0
                        && count <= permittedMaxAmbiguousDefs;
                })
                .map(getSuperscriptLinkMapper(context, vFile));
            if (hasMoreAmbiguousDefs) {
                linkNodes.push(html("<sup>...</sup>"));
            }
        }
        if (termOccurrenceNode.children.length === 0) {
            termOccurrenceNode.children = [
                link(
                    resolveGlossaryUrl(context, vFile, termDefinitionNode)
                    ,termDefinitionNode.getShortDescription()
                    ,text(linkText)
                )
                ,...linkNodes
            ];
        }
        return termOccurrenceNode;
    };
}

function getSuperscriptLinkMapper(context, vFile) {
    return (tNode, j) => {
        const shortDesc = tNode.getShortDescription();
        const glossUrl = resolveGlossaryUrl(context, vFile, tNode);
        return link(glossUrl, shortDesc,
            html(j === 0 ? `<sup>${j+2})</sup>` : `<sup> ${j+2})</sup>`)
        );
    };
}

function resolveGlossaryUrl(context, vFile, termDefinitionNode) {
    const glossVFile = termDefinitionNode.glossVFile;
    if (glossVFile.glossConf.linkUris && termDefinitionNode.uri) {
        return termDefinitionNode.uri;
    } else {
        const fromDocumentPath = vFile.path;
        const toGlossaryPath = glossVFile.path;
        return getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, termDefinitionNode.anchor);
    }
}
