const uVisit = require("unist-util-visit");
const {link, html} = require("mdast-builder");
const linkifyRegex = require("./ast/linkify");
const {getFileLinkUrl} = require("./path/tools");
const {Term} = require("./model/term");
const {getIndex} = require("./indexer");
const {collator} = require("./text/collator");
/**
 * @typedef {import("./model/context")} Context
 * @typedef {import("./model/term")} Term
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
// be undefined and would vary accross platforms and program executions.
// It's also important to compare by a distinct glossary path rather than
// just the glossary file name because it's likely there will be projects
// with multiple glossaries in different folders but all named 'glossary.md'.
function getTermsSorted() {
    const strComparator = collator.compare;
    // let terms = Object.keys(getIndex("term_defs")).sort(strComparator);
    let _byAnchor = getIndex("term_defs");
    let terms = Object.keys(_byAnchor).sort(strComparator);
    let result = [];
    for (let i = 0, len = terms.length; i < len; i++) {
        result.push(_byAnchor[terms[i]].sort((indexEntry1, indexEntry2) => Term.compare(indexEntry1.node, indexEntry2.node)));
    }
    return result;
}

/**
 * Linker operates on the abstract syntax tree for a markdown file
 * and searches for occurrences of a glossary term.
 *
 * @private
 * @param {{context: Context}} opts
 */
api.linker = function(opts) {
    const {context} = opts;
    const indexEntries = getTermsSorted();
    registerNodeTypes(this.Compiler);
    return (tree, vFile) => {
        uVisit(tree, getNodeVisitor(context, vFile, indexEntries));
        return tree;
    };
};

/**
 * Registers node type visitors with the compiler.
 *
 * @param {*} compiler
 */
function registerNodeTypes(compiler) {
    // Register noop visitors for node types that do not produce visible output
    // (e.g. by the 'remark_stringify' compiler) but which rather exist to
    // augment the AST with informal node types.
    compiler.prototype.visitors["term-occurrence"] = () => {};
}

/**
 * @private
 * @param {{context: Context}} opts
 */
function getNodeVisitor(context, vFile, indexEntries) {
    let headingNode = null;
    return (node) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let i = 0, len = indexEntries.length; i < len; i++) {
                linkifyAst(node, headingNode, indexEntries[i], context, vFile);
            }
            // Skip children. They've already been visited by regexLinkify.
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
function linkifyAst(paragraphNode, headingNode, termIndexEntries, context, vFile) {
    const hasMultipleDefs = termIndexEntries.length > 1;
    const termNodes = termIndexEntries.map(entry => entry.node);
    const termNode = termNodes[0];
    const newLinkNodes = [];
    const fromDocumentPath = vFile.path;
    const toGlossaryPath = termNode.glossary.vFile.path;

    // Search and insert link nodes
    const newParagraphNode = linkifyRegex(paragraphNode, termNode.regex, (linkNode) => {
        linkNode.title = termNode.getShortDescription();
        linkNode.url = getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, termNode.anchor);
        linkNode.children.push({
            type: "term-occurrence"
            ,value: termNode.value
            ,parent: linkNode
            ,termDefs: termNodes
            ,headingNode: headingNode
        });
        if (!hasMultipleDefs && termNode.hint) {
            if (/\$\{term\}/.test(termNode.hint)) {
                linkNode.children[0].value = termNode.hint.replace("${term}", linkNode.children[0].value);
            } else {
                linkNode.children[0].value += termNode.hint;
            }
        }
        newLinkNodes.push(linkNode);
        return linkNode;
    });

    // Has term multiple definitions?
    if (! hasMultipleDefs) {
        return newParagraphNode;
    }

    // Term has multiple definitions {0, 1, 2}. Insert additional (numbered) link nodes
    // after the term link node with links to each glossary definition.
    for (let i = 0, len = newLinkNodes.length; i < len; i++) {
        const pChildren = newParagraphNode.children;
        const lNode = newLinkNodes[i];
        const lNodePos = pChildren.indexOf(lNode);
        if (lNodePos >= 0) {
            newParagraphNode.children = pChildren
                .slice(0, lNodePos + 1)                                // split
                .concat(termNodes.map((t, j) => {
                    const toGlossaryPath = t.glossary.file;
                    const glossUrl = getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, t.anchor);
                    const shortDesc = t.getShortDescription();
                    return link(glossUrl, shortDesc,
                        html(j === 0 ? `<sup>${j+1})</sup>` : `<sup> ${j+1})</sup>`)
                    );
                }))
                .concat(pChildren.slice(lNodePos + 1));
        }

    }
    return newParagraphNode;
}

module.exports = api;
