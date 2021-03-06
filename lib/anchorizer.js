const GitHubSlugger = require("github-slugger");
const uVisit = require("unist-util-visit");
const {html} = require("mdast-builder");
const {getNodeText, getTableHeaders, getLastChildByType, isHtmlComment} = require("./ast/tools");
const api = {};


const HTML_COMMENT = /<!-- (.*) -->/;
const TABLE_LABEL_REGEXP = /<!-- table: (.*) -->/;
const TABLE_LABEL_REGEXP2 = /(.*):(\s|\n|$)/;

/**
 * Anchorizer searches the abstract syntax tree for figures and tables
 * and adds HTML anchors. This allows to link to them from a list of
 * figures and a lists of anchors.
 *
 * The indexer will then index those anchors by anchor class together
 * with any manually added anchors.
 *
 * Eventually writer will write the lists for particular classes of
 * indexed elements.
 *
 * @private
 * @param {{context: Context}} args
 */
api.anchorizer = function(args) {
    const {context} = args;
    const {listOf, listOfFigures, listOfTables} = context.conf.generateFiles;
    if (listOf.length > 0) {
        // assumes that listOfFigures and listOfTables configs have been
        // pushed to listOf configs during context initialization.
        const figuresClass = listOfFigures ? listOfFigures.class : "figure";
        const tablesClass  = listOfTables  ? listOfTables.class  : "table";
        return (tree, vFile) => {
            const slugger = new GitHubSlugger();
            uVisit(tree, getNodeVisitor(context, vFile, slugger, figuresClass, tablesClass));
            return tree;
        };
    } else {
        return (tree) => tree;
    }
};

function getNodeVisitor(context, file, slugger, figuresClass, tablesClass) {
    let htmlNodeDistance = 99;
    return function(node, index, parent) {
        const t = node.type;
        if (t === "html" && !node.value.match(HTML_COMMENT)) {
            htmlNodeDistance = 0;
        } else {
            htmlNodeDistance++;
        }
        if (htmlNodeDistance >= 3 && (t === "image" || t === "imageReference")) {
            return anchorizeImage(node, index, parent, slugger, figuresClass);
        } else if (htmlNodeDistance >= 2 && t === "table") {
            return anchorizeTable(node, index, parent, slugger, tablesClass);
        }
    };
}

/**
 * Prepends an HTML anchor tag to a markdown image to be able to directly
 * link and navigate to it. Anchorization allows to create a combined
 * "List of Figures" from static images detected by Markdown syntax and
 * (possibly dynamically rendered) images that have been explicitely
 * "annotated" with an HTML anchor tag with the same anchor class.
 *
 * Note that an HTML anchor will only be added if the direct previous sibling
 * node is neither an HTML node nor a paragraph node ending with an HTML node.
 *
 * @param {Node} node
 * @param {number} index
 * @param {Node} parent
 * @param {GitHubSlugger} slugger Slug algorithm to generate URL-friendly anchor ids
 * @param {string} anchorClass
 */
function anchorizeImage(node, index, parent, slugger, anchorClass) {
    // Note: The file-specific slugger internally counts figures with id "figure".
    const t = node.type;
    const id = slugger.slug(node.title || node.alt || "figure");
    let title = "";
    if (t === "image") {
        title = node.alt || node.title || node.url;
    } else if (t === "imageReference") {
        title = node.alt || node.label;
    }
    parent.children.splice(index, 0,
        html(`<a id="${id}" class="${anchorClass}" title="${title}">`),
        html("</a>")
    );
    return index + 3;
}

/**
 * Prepends an HTML anchor tag to a markdown table to be able to directly
 * link and navigate to it. Anchorization allows to create a combined
 * "List of Tables" from tables detected by Markdown syntax and
 * (possibly) tables shown, e.g in images that have been explicitely
 * "annotated" with an HTML anchor tag with the same anchor class.
 *
 * Note that an HTML anchor will only be added if the direct previous sibling
 * node is neither an HTML node nor a paragraph node ending with an HTML node.
 *
 * @param {Node} node
 * @param {number} index
 * @param {Node} parent
 * @param {GitHubSlugger} slugger Slug algorithm for URL-friendly anchors
 * @param {string} anchorClass
 */
function anchorizeTable(node, index, parent, slugger, anchorClass) {
    const label = getTableLabel(node, index, parent);
    const id = label ? slugger.slug(label) : "";
    parent.children.splice(index, 0,
        html(`<a id="${id}" class="${anchorClass}" title="${label}" />`)
    );
    return index + 2;
}

function getTableLabel(node, index, parent) {
    let label = "";
    let predecessor = parent.children[index - 1];
    const fromHtmlComment = isHtmlComment(predecessor);
    const fromParagraph = getLastChildByType("emphasis", predecessor);

    if (fromHtmlComment) {
        // Try infer label from html annotation comment
        const matches = predecessor.value.match(TABLE_LABEL_REGEXP);
        if (matches && matches.length > 1) {
            label = matches[1];
        }
    } else if (fromParagraph) {
        // Try infer label from preceding paragraph (must end with an *emphasis*)
        const matches = getNodeText(fromParagraph).match(TABLE_LABEL_REGEXP2);
        if (matches && matches.length > 1) {
            label = matches[1];
        }
    }

    if (! label) {
        // Try constructing a table label from table headings
        label = getTableHeaders(node)
            .filter(text => !!text)
            .join(", ");
    }
    return label;
}


module.exports = api;
