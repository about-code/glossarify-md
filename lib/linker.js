const uVisit = require("unist-util-visit");
const {link, html} = require("mdast-builder");

const linkifyRegex = require("./ast/linkify");
const {getFileLinkUrl} = require("./path/tools");
/**
 * @typedef {import("./model/context")} Context
 * @typedef {import("./model/term")} Term
 */

const api = {};


/**
 * Linker operates on the abstract syntax tree for a markdown file
 * and searches for occurrences of a glossary term.
 *
 * @private
 * @param {{context: Context}} opts
 */
api.linker = function(opts) {
    const {context} = opts;
    const {terms} = context;
    const termsByDefinition = terms.byDefinition();
    registerNodeTypes(this.Compiler);
    return (tree, vFile) => {
        uVisit(tree, getNodeVisitor(context, vFile, termsByDefinition));
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
function getNodeVisitor(context, vFile, termDefs) {
    let headingNode = null;
    return (node) => {
        if (node.type === "paragraph" || node.type === "tableCell") {
            for (let i = 0, len = termDefs.length; i < len; i++) {
                linkifyAst(node, headingNode, termDefs[i], context, vFile);
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
            ,parent: linkNode
            ,termDefs: termDefs
            ,headingNode: headingNode
        });
        if (!hasMultipleDefs && term.hint) {
            if (/\$\{term\}/.test(term.hint)) {
                linkNode.children[0].value = term.hint.replace("${term}", linkNode.children[0].value);
            } else {
                linkNode.children[0].value += term.hint;
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
                .concat(termDefs.map((t, j) => {
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
