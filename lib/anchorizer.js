const GitHubSlugger = require("github-slugger");
const uVisit = require("unist-util-visit");
const {html} = require("mdast-builder");
const {getNodeText, getTableHeaders, getLastChildByType, isHtmlComment} = require("./ast/tools");
const api = {};


const HTML_COMMENT = /<!-- (.*) -->/;
const TABLE_LABEL_REGEXP = /<!-- table: (.*) -->/;
const TABLE_LABEL_REGEXP2 = /(.*):(\s|\n|$)/;
const REGEXP_SANITIZE_HTML_ATTR = /["<>]/g;

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
    const generateFilesConf = context.conf.generateFiles;
    const listOf = generateFilesConf.listOf;

    // If there's a listOf-config (assumes that listOfFigures and listOfTables
    // configs have been merged with listOf config during context initialization)
    if (listOf.length > 0) {
        return (tree, vFile) => {
            const slugger = new GitHubSlugger();
            uVisit(tree, getNodeVisitor(context, vFile, slugger, generateFilesConf));
            return tree;
        };
    } else {
        return (tree) => tree;
    }
};

function getNodeVisitor(context, file, slugger, generateFilesConf) {
    let htmlNodeDistance = 99;
    return function(node, index, parent) {
        const t = node.type;
        if (t === "html" && !node.value.match(HTML_COMMENT)) {
            htmlNodeDistance = 0;
        } else {
            htmlNodeDistance++;
        }
        if (htmlNodeDistance >= 3 && (t === "image" || t === "imageReference")) {
            return anchorizeImage(node, index, parent, slugger, generateFilesConf);
        } else if (htmlNodeDistance >= 2 && t === "table") {
            return anchorizeTable(node, index, parent, slugger, generateFilesConf);
        } else if (htmlNodeDistance >= 3 && t === "paragraph") {
            return anchorizePattern(node, index, parent, slugger, generateFilesConf);
        }
    };
}

/**
 * Prepends an HTML anchor tag to a markdown text node matching a given pattern
 *
 * @param {Node} node
 * @param {number} index
 * @param {Node} parent
 * @param {GitHubSlugger} slugger Slug algorithm to generate URL-friendly anchor ids
 * @param {string} anchorClass
 */
function anchorizePattern(node, index, parent, slugger, generateFilesConf) {
    const {listOf} = generateFilesConf;
    const text = getNodeText(node) || "";
    let id_countTitle = 0;
    for (let i = 0, len = listOf.length; i < len; i++) {
        const anchorClass = listOf[i].class;
        const pattern = listOf[i].pattern;
        let title = "";
        let id = "";
        if (! pattern) {
            continue;
        }
        const match = text.match(pattern);
        if (! match) {
            continue;
        }
        if (match[1]) {
            title = match[1];
            id = `${slugger.slug(title.substr(0, 20))}`;
        } else {
            title = text.match(`(${pattern})`)[1];
            id_countTitle++;
            id = `${slugger.slug(title.substr(0, 20))}`;
        }
        title = title
            .replace(REGEXP_SANITIZE_HTML_ATTR, "")
            .trim();
        parent.children.splice(index, 0,
            html(`<span id="${id}" class="${anchorClass}" title="${title}"></span>`),
        );
        index += 1;
    }
    return index + 1;
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
function anchorizeImage(node, index, parent, slugger, generateFilesConf) {

    const listOfFigures = generateFilesConf.listOfFigures;
    const anchorClass = listOfFigures ? listOfFigures.class : "figure";
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
        html(`<a id="${id}" class="${anchorClass}" title="${title.replace(REGEXP_SANITIZE_HTML_ATTR, "")}">`),
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
function anchorizeTable(node, index, parent, slugger, generateFilesConf) {
    const listOfTables = generateFilesConf.listOfTables;
    const anchorClass = listOfTables ? listOfTables.class : "table";
    const label = getTableLabel(node, index, parent);
    const id = label ? slugger.slug(label) : "";
    parent.children.splice(index, 0,
        html(`<a id="${id}" class="${anchorClass}" title="${label.replace(REGEXP_SANITIZE_HTML_ATTR, "")}" />`)
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
