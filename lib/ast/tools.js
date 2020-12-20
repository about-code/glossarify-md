const path = require("path");
const toString = require("mdast-util-to-string");

/**
 * @typedef {{ type: string, children: Node[] }} Node
 */

const api = {};

/**
 * Return the text value of a node. Traverses a node's first-child path down to
 * the text node and returns the text node's value. Returns `undefined` if
 * there's no text node on that path.
 */
api.getNodeText = function(node) {
    return toString(node);
};

api.getHtmlNodeInnerText = function(htmlNode, parent) {
    if (parent) {
        const children = parent.children;
        let prev = "";
        let start = children.findIndex(node => node === htmlNode);
        let depth = 0;
        for (let i = start, len = children.length; i < len; i++) {
            const currNode = children[i];
            if (api.isHtmlOpenTag(currNode) && !api.isHtmlClosedTag(currNode)) {
                depth++;
            } else if (api.isHtmlClosingTag(currNode)) {
                depth--;
            } else if (depth > 0 && currNode.type !== "html") {
                prev += api.getNodeText(currNode);
            } else if (depth === 0) {
                break;
            }
        }
        return prev;
    }
};

api.isHtmlOpenTag = function(node) {
    if (node.type !== "html") { return false; }
    return /<(?!\/)/.test(node.value);
};

api.isHtmlClosedTag = function(node) {
    if (node.type !== "html") { return false; }
    const closedComment = "-->";
    const closedTag = "/>";
    const closeTag = /<\/(.*)>/;
    const value = node.value;
    return (
        value.substr(-closedComment.length) === closedComment ||
        value.substr(-closedTag.length) === closedTag ||
        value.match(closeTag)
    );
};

api.isHtmlClosingTag = function(node) {
    if (node.type !== "html") { return false; }
    const closeTag = /<\/(.*)>/;
    return closeTag.test(node.value);
};

/**
 * Return the URL of a link node or the first found 'link'-type child node.
 */
api.getLinkUrl = function getLinkUrl(node) {
    if (! node) {
        return;
    } else if (node.type === "link") {
        return node.url;
    } else if (node.children && node.children.length > 0) {
        return getLinkUrl(node.children[0]);
    } else {
        return;
    }
};

/**
 * @param {Node} tableNode Node of type "table"
 */
api.getTableHeaders = function(tableNode) {
    if (! tableNode) {
        return [];
    } else if (tableNode.type === "table") {
        return tableNode
            .children[0] // table-row [0]
            .children.map(tableCell => api.getNodeText(tableCell));
    } else {
        return [];
    }
};

/**
 * @param {Node} node
 */
api.isHtmlComment = function(node) {
    return node
        && node.type === "html"
        && node.value.substr(0, 4) === "<!--"
        && node.value.substr(-3) === "-->";
};

/**
 * @param {string} type
 * @param {Node} node
 */
api.getLastChildByType = function(type, node) {
    if (type && node && node.children) {
        const c = node.children;
        const last = c[c.length - 1];
        return last.type === type ? last : null;
    }
};

/**
 * Helper function for debugging purposes.
 */
api.printAst = function(args) {
    const regExpOrBool = args.match;
    return (tree, file) => {
        if (
            (typeof regExpOrBool === "boolean" && regExpOrBool === true) ||
            (typeof regExpOrBool === "string" &&
                path.resolve(file.dirname, file.basename).match(new RegExp(regExpOrBool))
            )
        ) {
            console.log(`
AST for '${file.path}' matched by '${regExpOrBool}'
└───────────────────────────────────────────────────────────────────────────────┐
${JSON.stringify(tree, null, 4)}
`);
        }

        return tree;
    };
};


module.exports = api;
