const path = require("path");
const api = {};

/**
 * @typedef {{ type: string, children: Node[] }} Node
 */

/**
 * Return the text value of a node. Traverses a node's first-child path down to
 * the text node and returns the text node's value. Returns `undefined` if
 * there's no text node on that path.
 */
api.getNodeText = function getNodeText(node) {
    if (! node)
        return;
    else if (node.type === "text")
        return node.value;
    else if (node.children && node.children.length > 0)
        return getNodeText(node.children[0]);
    else
        return;

};

api.getLinkUrl = function getLinkUrl(node) {
    if (! node)
        return;
    else if (node.type === "link")
        return node.url;
    else if (node.children && node.children.length > 0)
        return getLinkUrl(node.children[0]);
    else
        return;

};

/**
 * No-op compiler to satisfy unifiedjs
 * @private
 */
api.noopCompiler = function noopCompiler() {
    this.Compiler = function(tree) {
        return tree;
    };
};

/**
 * Helper function for debugging purposes.
 * @private
 */
api.printAst = function (opts) {
    const regExpOrBool = opts.match;
    return (tree, file) => {
        if (
            (typeof regExpOrBool === "boolean" && regExpOrBool === true) ||
            (typeof regExpOrBool === "string" &&
                path.resolve(file.dirname, file.basename).match(new RegExp(regExpOrBool))
            )
        )
            console.log(`
AST for '${file.path}' matched by '${regExpOrBool}'
└───────────────────────────────────────────────────────────────────────────────┐
${JSON.stringify(tree, null, 4)}
`);

        return tree;
    };
};


module.exports = api;
