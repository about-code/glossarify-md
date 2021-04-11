const uVisit = require("unist-util-visit");
const {link, html, text} = require("mdast-builder");
const {findReplace} = require("./ast/findReplace");
const {getFileLinkUrl} = require("./path/tools");
const {TermDefinitionNode} = require("./ast/with/term-definition");
const {TermOccurrenceNode} = require("./ast/with/term-occurrence");
const {getIndex} = require("./indexer");
const {IDX_TERMS_BY_ANCHOR} = require("./index/terms");
/**
 * @typedef {import("./model/context")} Context
 */

const api = {};


/**
 * Returns a two-dimentional array of term definitions in alphabetical
 * order where the first dimension represents a term and the second all
 * its definitions in particular glossaries.
 */
// Implementation note:
// Establishes an order on both dimensions. The term instances in 2nd
// dimension are sorted based on term and glossary path for reproducable
// results and reliable diff-testing. Otherwise if a term were defined in
// two glossaries the order of link references in markdown output would
// be undefined and would vary across platforms and program executions.
// It's also important to compare by a distinct glossary path rather than
// just the glossary file name because it's likely there will be projects
// with multiple glossaries in different folders but all named 'glossary.md'.
function getTermsSorted() {
    // let terms = Object.keys(getIndex(IDX_TERMS_BY_ANCHOR)).sort(strComparator);
    let _byAnchor = getIndex(IDX_TERMS_BY_ANCHOR);
    let terms = Object.keys(_byAnchor).sort((left, right) => right.length - left.length);
    let result = [];
    for (let i = 0, len = terms.length; i < len; i++) {
        result.push(_byAnchor[terms[i]]
            .sort((indexEntry1, indexEntry2) => TermDefinitionNode.compare(indexEntry1.node, indexEntry2.node)));
    }
    return result;
}

/**
 * @private
 * @param {{context: Context}} args
 */
api.linker = function(args) {
    const {context} = args;
    const indexEntriesMap = getTermsSorted();
    const indexEntriesByAnchor = getIndex(IDX_TERMS_BY_ANCHOR);
    return (tree, vFile) => {
        uVisit(tree, ["link"], getLinkVisitor(context, vFile, indexEntriesByAnchor));
        uVisit(tree, getLinkifyVisitor(context, vFile, indexEntriesMap));
        return tree;
    };
};


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
*/
function getLinkVisitor(context, vFile, indexEntriesMap) {
    return (lNode) => {
        const anchor = lNode.url;
        const tNodeIndexEntry = indexEntriesMap[anchor];
        if (tNodeIndexEntry && tNodeIndexEntry.length === 1) {
            // anchor is unique (Rule 1)
            lNode.url = resolveGlossaryUrl(context, vFile, tNodeIndexEntry[0].node);
        }
        // else {
        //    if there is a local definition, then Rule 2 can be satisifed by doing nothing.
        //    if there is no local declaration then Rule 3 must be satisfied by doing nothing.
        // }
        return uVisit.SKIP;
    };
}

/**
 * @private
 * @param {{context: Context}} context
 * @param {VFile} vFile
 * @param {[key]: IndexEntry[]} indexEntriesMap
 */
function getLinkifyVisitor(context, vFile, indexEntriesMap) {
    let headingNode = null;
    return (node) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let i = 0, len = indexEntriesMap.length; i < len; i++) {
                const indexEntrySet = indexEntriesMap[i];
                linkifyAst(node, headingNode, indexEntrySet, context, vFile);
            }
            // Skip children. They've already been visited by linkifyAst.
            return uVisit.SKIP;
        } else if (node.type === "heading") {
            headingNode = node;
            return uVisit.SKIP;
        } else if (node.type === "blockquote" || node.type === "html") {
            return uVisit.SKIP;
        } else {
            return uVisit.CONTINUE;
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
function linkifyAst(paragraphNode, headingNode, indexEntrySet, context, vFile) {
    const linking = context.conf.linking
        , limitMaxAlternativeDefs = Math.abs(linking.limitByAlternatives)
        , countDefinitions = indexEntrySet.length
        , countAlternativeDefs = countDefinitions - 1
        , hasAlternativeDefs = countAlternativeDefs > 0
        , hasMaxAlternativeDefs = countAlternativeDefs >= limitMaxAlternativeDefs
        , hasMoreAlternativeDefs = countAlternativeDefs > limitMaxAlternativeDefs
        , skipOnMaxAlternativeDefs = Math.sign(linking.limitByAlternatives) < 0
        , termNodes = indexEntrySet.map(e => e.node)
        , termNode = termNodes[0]
        , maxReplacements = (linking.mentions === "first-in-paragraph") ? 1 : Infinity
        ;
    let countReplacements = 0;
    let linkNodes = [];

    if (linking.headingDepths[termNode.headingDepth] !== true) {
        return;
    }
    if (hasMaxAlternativeDefs && skipOnMaxAlternativeDefs) {
        return;
    }
    if (hasAlternativeDefs && limitMaxAlternativeDefs > 0) {
        linkNodes = termNodes
            .filter((e, idx) => idx > 0 && idx <= limitMaxAlternativeDefs)
            .map(getSuperscriptLinkMapper(context, vFile));
        if (hasMoreAlternativeDefs) {
            linkNodes.push(html("<sup>...</sup>"));
        }
    }

    // Search for term and insert a term occurrence node
    // Omit termHint if there are multiple definitions and superscript links
    const newParagraphNode = findReplace(paragraphNode, termNode.regex, (linkText) => {
        if (countReplacements >= maxReplacements) {
            return text(linkText);
        }
        if (!hasAlternativeDefs && termNode.hint) {
            if (/\$\{term\}/.test(termNode.hint)) {
                linkText = termNode.hint.replace("${term}", linkText);
            } else {
                linkText += termNode.hint;
            }
        }
        countReplacements++;
        return new TermOccurrenceNode({
            parent: paragraphNode
            ,headingNode: headingNode
            ,termDefs: termNodes
            ,value: linkText
            ,children: [
                link(
                    resolveGlossaryUrl(context, vFile, termNode)
                    ,termNode.getShortDescription()
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

function resolveGlossaryUrl(context, vFile, node) {
    const fromDocumentPath = vFile.path;
    const toGlossaryPath = node.glossary.vFile.path;
    return getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, node.anchor);
}

module.exports = api;
