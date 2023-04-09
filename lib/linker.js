import { html, link, text } from "mdast-builder";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import { findReplace } from "./ast/find-replace.js";
import { TermDefinitionNode } from "./ast/with/term-definition-node.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence-node.js";
import { IDX_TERMS_BY_ID, IDX_TERMS_BY_PHRASE } from "./index/terms.js";
import { getIndex } from "./indexer.js";
import { classifyRelationshipFromTo, getFileLinkUrl } from "./path/tools.js";
/**
 * @typedef {import("./model/context")} Context
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
     * @param { {key: IndexEntry<TermDefinitionNode>[] }} indexOfDefinitionsByPhrase indexed by value (hash)
     * @return { Array<TermDefinitionNodes[]>} Array of Arrays with term definition nodes
     */
    const getTermsSorted = function (indexOfDefinitionsByPhrase) {
        return Object
            .keys(indexOfDefinitionsByPhrase)
            .map(phrase =>
                indexOfDefinitionsByPhrase[phrase]
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

    const termsById = getIndex(IDX_TERMS_BY_ID);
    const termsByPhrase = getIndex(IDX_TERMS_BY_PHRASE);
    const termDefinitionNodes = getTermsSorted(termsByPhrase);


    return () => {
        /**
         * A histogram of term occurrences for particular glossaries.
         * @type { { key: number }}
         */
        const glossaryStats = {};
        return (tree, vFile) => {
            visit(tree, ["link"], getLinkVisitor(context, vFile, termsById));
            visit(tree, getLinkifyVisitor(context, vFile, termDefinitionNodes, glossaryStats));
            visit(tree, [TermOccurrenceNode.type], getTermOccurrenceVisitor(context, vFile, glossaryStats));
            return tree;
        };
    };
}

/**
 * Resolves links with anchors matching a custom heading-id according to the
 * following rules:
 *
 * 1. Given #custom-heading-id is unique across documents then a path to the
 *    file declaring #custom-heading-id should be prepended (see example below)
 * 2. Given #custom-heading-id is not unique across documents then local
 *    declaration should take precedence over external declaration.
 * 3. Given #custom-heading-id is not unique across documents and there is no
 *    local declaration, either, then it should not be modified.
 *
 * @param {Context} context
 * @param {vFile} vFile
 * @param {[key]: IndexEntry[]} indexEntriesMap  A map of IndexEntries for TermDefinition nodes with key being the term anchor
 */
function getLinkVisitor(context, vFile, indexEntriesMap) {
    return (lNode) => {
        const headingId = lNode.url.replace("#", "");
        const termDefinitionIndexEntry = indexEntriesMap[headingId];
        if (termDefinitionIndexEntry && termDefinitionIndexEntry.length === 1) {
            // anchor is unique (Rule 1)
            lNode.url = resolveGlossaryUrl(context, vFile, termDefinitionIndexEntry[0].node);
            lNode.title = lNode.title || termDefinitionIndexEntry[0].node.getShortDescription();
        }
        // else {
        //    if there is a local definition, then Rule 2 can be satisifed by doing nothing.
        //    if there is no local declaration then Rule 3 must be satisfied by doing nothing.
        // }
        return SKIP;
    };
}

/**
 * @private
 * @param {{context: Context}} context
 * @param {VFile} vFile
 * @param {Array<TermDefinitionNode[]>} termDefinitions A two-dimensional Array of Arrays where 1st dimension represents a term and 2nd all the term's term definition nodes.
 */
function getLinkifyVisitor(context, vFile, termDefinitions, glossaryStats) {
    let headingNode = null;
    return (node) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let i = 0, len = termDefinitions.length; i < len; i++) {
                linkifyAst(node, headingNode, termDefinitions[i], context, vFile, glossaryStats);
            }
            return SKIP; // Skip children. Already been visited by linkifyAst.
        } else if (node.type === "heading") {
            headingNode = node;
            return SKIP;
        } else if (node.type === "blockquote" || node.type === "html") {
            return SKIP;
        } else {
            return CONTINUE;
        }
    };
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
 * @param {Node} newParagraphNode text or paragraph node to search for term occurrence
 * @param {Node} headingNode the heading node preceding a paragraph node
 * @param {IndexEntry[]} termDefinitionNodes One or more definitions of the term to look for
 * @param {Context} context context object
 * @param {VFile} vFile current markdown document file
 * @returns AST node with links
 */
function linkifyAst(paragraphNode, headingNode, termDefinitionNodes, context, vFile, glossaryStats) {

    const linking = context.conf.linking
        , permittedHeadingDepths = linking.headingDepths
        , permittedRelationships = linking.limitByTermOrigin
        , permittedMaxAmbiguousDefs = Math.abs(linking.limitByAlternatives)
        , skipOnMaxAmbiguousDefs = Math.sign(linking.limitByAlternatives) < 0
        , validDefinitionNodes = termDefinitionNodes.filter(node =>
            filterByHeadingDepth(node, permittedHeadingDepths) &&
            filterByRelationship(node, permittedRelationships, vFile)
        )
        , countDefinitions = validDefinitionNodes.length
        , countAmbiguousDefs = countDefinitions - 1
        , hasAmbiguousDefs = countAmbiguousDefs > 0
        , hasMaxAmbiguousDefs = countAmbiguousDefs >= permittedMaxAmbiguousDefs
        , maxReplacements = (linking.mentions === "first-in-paragraph") ? 1 : Infinity
        , termDefinitionNode = validDefinitionNodes[0]
        ;

    if (! termDefinitionNode) {
        return;
    }
    if (hasMaxAmbiguousDefs && skipOnMaxAmbiguousDefs) {
        return;
    }

    let countReplacements = 0;
    const newParagraphNode = findReplace(paragraphNode, termDefinitionNode.regex, (linkText) => {
        if (countReplacements >= maxReplacements) {
            return text(linkText);
        } else {
            countReplacements++;
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
    });
    return newParagraphNode;
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
    const linking = context.conf.linking;

    return (termOccurrenceNode) => {
        let validDefinitionNodes = termOccurrenceNode.termDefs;
        const countAmbiguousDefs = validDefinitionNodes.length - 1
            , hasAmbiguousDefs = countAmbiguousDefs > 0
            , permittedMaxAmbiguousDefs = Math.abs(linking.limitByAlternatives)
            , hasMoreAmbiguousDefs = countAmbiguousDefs > permittedMaxAmbiguousDefs
            ;
        let linkText = termOccurrenceNode.value;


        // ________/ Context-aware linking for ambiguous terms \________
        // In case of multiple definitions for a term priortize glossary
        // definitions which best fit within the context of a file.
        // "Best contextual fit" is derived from a histogram that counts
        // (unambiguous) term occurrences for glossaries. We then sort
        // (= priortize) the glossaries by how often their (unambiguous)
        // terms have been mentioned within a file.
        if (hasAmbiguousDefs) {
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

        termOccurrenceNode.children = [
            link(
                resolveGlossaryUrl(context, vFile, termDefinitionNode)
                ,termDefinitionNode.getShortDescription()
                ,text(linkText)
            )
            ,...linkNodes
        ];
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
