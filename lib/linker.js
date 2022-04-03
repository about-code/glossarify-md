import { html, link, text } from "mdast-builder";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import { findReplace } from "./ast/findReplace.js";
import { TermDefinitionNode } from "./ast/with/term-definition.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence.js";
import { IDX_TERMS_BY_ID, IDX_TERMS_BY_PHRASE } from "./index/terms.js";
import { getIndex } from "./indexer.js";
import { classifyRelationshipFromTo, getFileLinkUrl } from "./path/tools.js";
/**
 * @typedef {import("./model/context")} Context
 */

/**
 * @private
 * @param {Context} context
 */
export function linker(context) {
    /**
     * Returns a two-dimentional array of term definitions in alphabetical
     * order where the first dimension represents a term and the second all
     * its definitions in particular glossaries.
     *
     * @param { {key: IndexEntry<TermDefinitionNode>[] }} TermDefinitionNodes indexed by value (hash)
     */
    const getTermsSorted = function (indexEntries) {
        // let terms = Object.keys(_byAnchor).sort(strComparator);
        let keys = Object.keys(indexEntries);
        let result = [];
        for (let i = 0, len = keys.length; i < len; i++) {
            result.push(indexEntries[keys[i]]
                .map(indexEntry => indexEntry.node)
                .sort((termDefinitionNode1, termDefinitionNode2) => {
                    return TermDefinitionNode.compare(termDefinitionNode1, termDefinitionNode2);
                }));
        }
        return result;
        // Implementation note:
        // Establishes an order on both dimensions. The term instances in 2nd
        // dimension are sorted based on term and glossary path for reproducable
        // results and reliable diff-testing. Otherwise if a term were defined in
        // two glossaries the order of link references in markdown output would
        // be undefined and would vary across platforms and program executions.
        // It's also important to compare by a distinct glossary path rather than
        // just the glossary file name because it's likely there will be projects
        // with multiple glossaries in different folders but all named 'glossary.md'.
    };

    /** @type {{ key: IndexEntry<TermDefinitionNode>[] }} */
    const termsById = getIndex(IDX_TERMS_BY_ID);

    /** @type {{ key: IndexEntry<TermDefinitionNode>[] }} */
    const termsByPhrase = getIndex(IDX_TERMS_BY_PHRASE);
    const termDefinitionNodes = getTermsSorted(termsByPhrase);
    return (tree, vFile) => {
        visit(tree, ["link"], getLinkVisitor(context, vFile, termsById));
        visit(tree, getLinkifyVisitor(context, vFile, termDefinitionNodes));
        return tree;
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
 * @param {[key]: IndexEntry[]} indexEntriesMap A map of IndexEntries for TermDefinition nodes with key being the term anchor
 */
function getLinkifyVisitor(context, vFile, termDefinitions) {
    let headingNode = null;
    return (node) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let i = 0, len = termDefinitions.length; i < len; i++) {
                linkifyAst(node, headingNode, termDefinitions[i], context, vFile);
            }
            // Skip children. They've already been visited by linkifyAst.
            return SKIP;
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
 * Scans the given paragraph node for occurrences of a term, splits its text
 * node children at term positions and inserts link nodes for each term.
 *
 * @private
 * @param {Node} newParagraphNode text or paragraph node to search for term occurrence
 * @param {Node} headingNode the heading node preceding a paragraph node
 * @param {IndexEntry[]} termEntries One or more glossary definitions of a particular term
 * @param {Context} context context object
 * @param {VFile} vFile current markdown document file
 * @returns AST node with links
 */
function linkifyAst(paragraphNode, headingNode, termDefinitionNodes, context, vFile) {

    const linking = context.conf.linking
        , linkifyHeadingDepths = linking.headingDepths
        , allowedRelationships = linking.limitByTermOrigin
        , validDefinitionNodes = termDefinitionNodes.filter(node => {
            let result = true;
            if (Object.keys(allowedRelationships).length > 0) {
                const rel = classifyRelationshipFromTo(vFile.path, node.glossVFile.path);
                result &= allowedRelationships[rel];
            }
            result &= !!linkifyHeadingDepths[node.headingDepth];
            return result;
        })
        , countDefinitions = validDefinitionNodes.length
        , countAlternativeDefs = countDefinitions - 1
        , maxAlternativeDefs = Math.abs(linking.limitByAlternatives)
        , hasAlternativeDefs = countAlternativeDefs > 0
        , hasMaxAlternativeDefs = countAlternativeDefs >= maxAlternativeDefs
        , hasMoreAlternativeDefs = countAlternativeDefs > maxAlternativeDefs
        , skipOnMaxAlternativeDefs = Math.sign(linking.limitByAlternatives) < 0
        , maxReplacements = (linking.mentions === "first-in-paragraph") ? 1 : Infinity
        , termDefinitionNode = validDefinitionNodes[0]
        ;

    let countReplacements = 0;
    let linkNodes = [];

    if (!termDefinitionNode) {
        return;
    }

    if (skipOnMaxAlternativeDefs && hasMaxAlternativeDefs) {
        // see option linking.limitByAlternatives (positive range exceeded)
        return;
    }
    if (hasAlternativeDefs && maxAlternativeDefs > 0) {
        linkNodes = validDefinitionNodes
            .filter((node, count) => {
                return node !== termDefinitionNode
                    && linkifyHeadingDepths[node.headingDepth]
                    && count > 0 && count <= maxAlternativeDefs;
            })
            .map(getSuperscriptLinkMapper(context, vFile));
        if (hasMoreAlternativeDefs) {
            linkNodes.push(html("<sup>...</sup>"));
        }
    }

    // Search for term and insert a term occurrence node
    // Omit termHint if there are multiple definitions and superscript links
    const newParagraphNode = findReplace(paragraphNode, termDefinitionNode.regex, (linkText) => {
        if (countReplacements >= maxReplacements) {
            return text(linkText);
        }
        if (!hasAlternativeDefs && termDefinitionNode.hint) {
            if (/\$\{term\}/.test(termDefinitionNode.hint)) {
                linkText = termDefinitionNode.hint.replace("${term}", linkText);
            } else {
                linkText += termDefinitionNode.hint;
            }
        }
        countReplacements++;
        return new TermOccurrenceNode({
            headingNode: headingNode
            ,termDefs: validDefinitionNodes
            ,value: linkText
            ,children: [
                link(
                    resolveGlossaryUrl(context, vFile, termDefinitionNode)
                    ,termDefinitionNode.getShortDescription()
                    ,text(linkText)
                )
                , ...linkNodes
            ]
        });
    });
    return newParagraphNode;
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
    const pathRewrites = context.conf.linking.pathRewrites;
    if (glossVFile.glossConf.linkUris && termDefinitionNode.uri) {
        return termDefinitionNode.uri;
    } else {
        const fromDocumentPath = vFile.path;
        const toGlossaryPath = glossVFile.path;
        const linkUrl = getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, termDefinitionNode.anchor);
        return Object
            .keys(pathRewrites)
            .reduce((prevResult, regExpAsKey) => {
                return prevResult.replace(new RegExp(regExpAsKey), pathRewrites[regExpAsKey]);
            }, linkUrl);

    }
}
