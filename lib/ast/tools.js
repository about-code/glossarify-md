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
api.getNodeText = function getNodeText(node) {
    return toString(node);
};

api.getHtmlNodeInnerText = function getHtmlNodeInnerText(htmlNode, parent) {
    if (parent) {
        const children = parent.children;
        let isHtml = false;
        return children.reduce((prev, currNode) => {
            if (isHtmlOpenTag(currNode) && !isHtmlClosedTag(currNode)) {
                isHtml = true;
            } else if (isHtmlClosingTag(currNode)) {
                isHtml = false;
            } else if (isHtml && currNode.type !== "html") {
                return prev + api.getNodeText(currNode);
            }
            return prev;
        }, "");
    }
};

function isHtmlOpenTag(node) {
    if (node.type !== "html") { return false; }
    const openTag = "<";
    return node.value[0] === openTag;
}

function isHtmlClosedTag(node) {
    if (node.type !== "html") { return false; }
    const closedComment = "-->";
    const closedTag = "/>";
    const value = node.value;
    return (
        value.substr(-closedComment.length) === closedComment ||
        value.substr(-closedTag.length) === closedTag
    );
}
function isHtmlClosingTag(node) {
    if (node.type !== "html") { return false; }
    const closeTag = "</";
    return node.value.substr(0, closeTag.length) === closeTag;
}


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

api.getTableHeaders = function getTableHeaders(tableNode) {
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

api.isHtmlComment = function isHtmlComment(node) {
    return node
        && node.type === "html"
        && node.value.substr(0, 4) === "<!--"
        && node.value.substr(-3) === "-->";
};


api.getLastChildByType = function getLastChildByType(type, node) {
    if (type && node && node.children) {
        const c = node.children;
        const last = c[c.length - 1];
        return last.type === type ? last : null;
    }
};

/**
 * Helper function for debugging purposes.
 */
api.printAst = function printAst(opts) {
    const regExpOrBool = opts.match;
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
