const uVisit = require("unist-util-visit");
const remark_stringify = require("remark-stringify");
const {link, html} = require("mdast-builder");

const linkifyRegex = require("./ast/linkify");
const {getFileLinkUrl} = require("./path/tools");
/**
 * @typedef {import("./model/context")} Context
 * @typedef {import("./model/term")} Term
 */

const api = {};

// Tell remark_stringify to not produce any output for a term occurrence
remark_stringify.Compiler.prototype.visitors["term-occurrence"] = () => {};
remark_stringify.Compiler.prototype.visitors["image-occurrence"] = () => {};


/**
 * Linker operates on the abstract syntax tree for a markdown file
 * and searches for occurrences of a glossary term.
 *
 * @private
 * @param {{context: Context}} opts
 */
api.linker = function(opts) {
    const {context} = opts;
    return (tree, vFile) => {
        uVisit(tree, getNodeVisitor(context, vFile));
        return tree;
    };
};

/**
 * @private
 * @param {{context: Context}} opts
 */
function getNodeVisitor(context, vFile) {
    const {terms} = context;
    let headingNode = null;
    return (node) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            terms.byDefinition().forEach(termDefs => {
                linkifyAst(node, headingNode, termDefs, context, vFile);
            });
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
 * @param {Term[]} termDefs One or more glossary definitions of a particular term
 * @param {Context} context context object
 * @param {VFile} vFile current markdown document file
 * @returns AST node with links
 */
function linkifyAst(paragraphNode, headingNode, termDefs, context, vFile) {
    const hasMultipleDefs = termDefs.length > 1;
    const term = termDefs[0];
    const newLinkNodes = [];
    const fromDocumentPath = vFile.path;
    const toGlossaryPath = term.glossary.vFile.path;

    // Search and insert link nodes
    const newParagraphNode = linkifyRegex(paragraphNode, term.regex, (linkNode) => {
        linkNode.title = term.getShortDescription();
        linkNode.url = getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, term.anchor);
        linkNode.children.push({
            type: "term-occurrence"
            ,termDefs: termDefs
            ,headingNode: headingNode
        });
        if (! hasMultipleDefs) {
            if (term.hint) {
                if (/\$\{term\}/.test(term.hint)) {
                    linkNode.children[0].value = term.hint.replace("${term}", linkNode.children[0].value);
                } else {
                    linkNode.children[0].value += term.hint;
                }
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
        const lNode = newLinkNodes[i];
        const pChildren = newParagraphNode.children;
        const lNodePos = pChildren.indexOf(lNode);
        if (lNodePos >= 0) {
            newParagraphNode.children = pChildren
                .slice(0, lNodePos + 1)                                // split
                .concat(termDefs                                       // insert
                    .map((t, j) => {
                        const toGlossaryPath = t.glossary.file;
                        const glossUrl = getFileLinkUrl(context, fromDocumentPath, toGlossaryPath, t.anchor);
                        const shortDesc = t.getShortDescription();
                        return link(glossUrl, shortDesc,
                            html(j === 0 ? `<sup>${j+1})</sup>` : `<sup> ${j+1})</sup>`)
                        );
                    })
                )
                .concat(pChildren.slice(lNodePos + 1));
        }

    }
    return newParagraphNode;
}

module.exports = api;
