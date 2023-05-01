import { html, link, text } from "mdast-builder";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import { findReplace } from "./ast/find-replace.js";
import { TermDefinitionNode } from "./ast/with/term-definition-node.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence-node.js";
import { IDX_TERMS_BY_ID, IDX_TERMS_BY_PHRASE } from "./index/terms.js";
import { TermOccurrenceContextNode } from "./model/term-occurrence-context-node.js";
import { getIndex } from "./indexer.js";
import { classifyRelationshipFromTo, getFileLinkUrl } from "./path/tools.js";
import { getNodeText } from "./ast/tools.js";

const REGEXP_REFCOUNT_EVAL_SCOPE = /^by-glossary-refCount-per-(section|file)/;

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
        return (tree, vFile) => {

            /**
             * A semantic context providing a histogram of term-glossary
             * distribution to help disambiguate ambiguous terms to their
             * most likely definition in a book section.
             */
            const termOccurrenceContexts = new TermOccurrenceContextNode();

            visit(tree, getSearchVisitor(
                context
                , vFile
                , termDefinitions2D
                , termIndexEntriesById
                , termOccurrenceContexts
            ));
            visit(termOccurrenceContexts, getTermOccurrenceVisitor(
                context
                , vFile
            ));
            return tree;
        };
    };
}

/**
 * @private
 * @param {Context} context
 * @param {VFile} vFile
 * @param {Array<TermDefinitionNode[]>} termDefinitions2D A two-dimensional Array of Arrays where the first dimension represents a term and the second dimension all the term's definitions. With just one glossary each term usually has just one definition and the array at a position termDefinitions2D[i] is typically an array of size one for all terms i. With multiple glossaries and n definitions for a particular term the array at a position termDefinitions2D[i] can be an array of size n for a particular i.
 * @param {TermOccurrenceContextNode} termContextTree
 */
function getSearchVisitor(
    context
    , vFile
    , termDefinitions2D
    , termIndexEntriesById
    , termContextTree
) {
    let headingNode = null;
    const termContextKind = context.conf.linking.sortAlternatives;
    const termContextScope = parseInt(termContextKind.slice(-1)) || 0;
    const isTermContextScopeHeading = REGEXP_REFCOUNT_EVAL_SCOPE.test(termContextKind);
    let currentTermContext = termContextTree;
    return (node, index, parent) => {

        // Performance: if statements for node types that are likely to be found the
        // most in a typical Markdown document should be put earliear.
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let term_i = 0, len = termDefinitions2D.length; term_i < len; term_i++) {
                const termDefinitionNodes = termDefinitions2D[term_i];
                findTermOccurrencesByPhrase(node, headingNode, termDefinitionNodes, context, vFile, currentTermContext);
            }
            // Can't SKIP since paragraphs might have 'link' node children which
            // denote term occurrences linked to their term definitions by id
            // (identifier-based cross-linking)
            return CONTINUE;
        } else if (node.type === "heading") {
            if (isTermContextScopeHeading && node.depth <= termContextScope) {
                const newTermContext = new TermOccurrenceContextNode();
                currentTermContext.children.push(newTermContext);
                currentTermContext = newTermContext;
            }
            headingNode = node;
            return SKIP;
        } else if (node.type === "blockquote") {
            return SKIP;
        } else if (node.type === "link") {
            findTermOccurrenceById(node, headingNode, termIndexEntriesById, context, vFile, currentTermContext, index, parent);
            return SKIP;
        } else if (node.type === TermOccurrenceNode.type) {
            return SKIP;
        } else if (node.type === "html") {
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
 * @param {LinkNode} linkNode
 * @param {HeadingNode} headingNode
 * @param {[key]: IndexEntry[]} indexEntriesById
 * @param {Context} context processing context
 * @param {VFile} vFile current document file
 * @param {TermOccurrenceContextNode} termContextNode current term disambiguation context
 * @param {number} nodeIndex AST index of node
 * @param {Node} nodeParent Parent node
 * @returns {VisitorResult}
 */
function findTermOccurrenceById(
    linkNode
    , headingNode
    , indexEntriesById
    , context
    , vFile
    , termContextNode
    , nodeIndex
    , nodeParent
) {
    const headingId = linkNode.url.replace("#", "")
        , termDefinitionIndexEntry = indexEntriesById[headingId]
        , termGlossaryDistrib = termContextNode.histogram
        , termOccurrencesFound = termContextNode.children;

    if (termDefinitionIndexEntry && termDefinitionIndexEntry.length === 1) {
        const termDefinitionNode = termDefinitionIndexEntry[0].node
            , glossFile = termDefinitionNode.file
            , linkText = getNodeText(linkNode)
            , termOccurrenceNode = new TermOccurrenceNode({
                headingNode: headingNode
                ,termDefs:  [termDefinitionNode]
                ,value: linkText
                ,children: [linkNode]
            });

        // anchor is unique (Rule 1)
        linkNode.url = resolveGlossaryUrl(context, vFile, termDefinitionNode);
        linkNode.title = linkNode.title || termDefinitionNode.getShortDescription();

        // Collect stats on terminology use from glossary
        if (termGlossaryDistrib[glossFile]) {
            termGlossaryDistrib[glossFile] += 1;
        } else {
            termGlossaryDistrib[glossFile] = 1;
        }
        termOccurrencesFound.push(termOccurrenceNode);
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
 * @param {TermOccurrenceContextNode} termContextNode current term disambiguation context
 */
function findTermOccurrencesByPhrase(
    paragraphNode
    , headingNode
    , termDefinitionNodes
    , context
    , vFile
    , termContextNode
) {
    let countTermOccurrences = 0;
    const { headingDepths, limitByAlternatives, limitByTermOrigin, mentions } = context.conf.linking;
    const maxTermOccurrencesToLinkify = (mentions === "first-in-paragraph") ? 1 : Infinity
        , termGlossaryDistrib = termContextNode.children
        , termOccurrencesFound = termContextNode.histogram
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
            termGlossaryDistrib.push(termOccurrenceNode);

            // Collect distribution of term occurrences over glossaries to assist
            // choosing the most likely glossary definition for a term
            // occurrence when there are multiple ambiguous definitions
            for (let i = 0; i < validDefinitionNodes.length; i++) {
                const glossFile = validDefinitionNodes[i].file;
                if (termOccurrencesFound[glossFile]) {
                    termOccurrencesFound[glossFile] += 1;
                } else {
                    termOccurrencesFound[glossFile] = 1;
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
    let histogram = {};

    return (node) => {
        if (node.type === TermOccurrenceContextNode.type) {
            histogram = node.histogram;
        } else if (node.type === TermOccurrenceNode.type) {
            linkify(node, histogram, limitByAlternatives, sortAlternatives, context, vFile);
            return SKIP;
        }
    };
}

function linkify(node, histogram, limitByAlternatives, sortAlternatives, context, vFile) {
    let validDefinitionNodes = node.termDefs;
    const countAmbiguousDefs = validDefinitionNodes.length - 1
        , hasAmbiguousDefs = countAmbiguousDefs > 0
        , permittedMaxAmbiguousDefs = Math.abs(limitByAlternatives)
        , hasMoreAmbiguousDefs = countAmbiguousDefs > permittedMaxAmbiguousDefs
        ;
    let linkText = node.value;


    // __/ Config option linking.sortAlternatives = "by-terminology-in-file" \__
    // In case of an ambiguous term sort its definitions such that the
    // definition from the glossary comes first whose terms have been mentioned
    // the most.
    if (hasAmbiguousDefs && REGEXP_REFCOUNT_EVAL_SCOPE.test(sortAlternatives)) {
        validDefinitionNodes = validDefinitionNodes.sort((termDef1, termDef2) => {
            const glossaryTermsFound1 = histogram[termDef1.file] || 0;
            const glossaryTermsFound2 = histogram[termDef2.file] || 0;
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
    // Link all definitions at term occurrence by adding additional
    // links to alternative definitions but limit their number when the user
    // configured an upper limit.
    let linkNodes = [];
    if (hasAmbiguousDefs && permittedMaxAmbiguousDefs > 0) {
        linkNodes = validDefinitionNodes
            .slice(1, 1 + permittedMaxAmbiguousDefs)
            .filter(tNode => tNode !== termDefinitionNode)
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
                resolveGlossaryUrl(context, vFile, termDefinitionNode)
                ,termDefinitionNode.getShortDescription()
                ,text(linkText)
            )
            ,...linkNodes
        ];
    }
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
