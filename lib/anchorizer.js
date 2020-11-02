const GitHubSlugger = require("github-slugger");
const uVisit = require("unist-util-visit");
const {html} = require("mdast-builder");
const {getNodeText, getTableHeaders, getLastChildByType, isHtmlComment} = require("./ast/tools");
const api = {};
/**
 * Linker operates on the abstract syntax tree for a markdown file
 * and searches for occurrences of a glossary term.
 *
 * @private
 * @param {{context: Context}} opts
 */
api.anchorizer = function(args) {
    const {context} = args;
    const {listOf, listOfFigures, listOfTables} = context.opts.generateFiles;
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
    return function(node, index, parent) {
        const t = node.type;
        if (t === "image" || t === "imageReference") {
            return anchorizeImage(node, index, parent, slugger, figuresClass);
        } else if (t === "table") {
            return anchorizeTable(node, index, parent, slugger, tablesClass);
        }
    };
}

function anchorizeImage(node, index, parent, slugger, classifier) {
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
        html(`<a id="${id}" class="${classifier}" title="${title}">`),
        html("</a>\n")
    );
    return index + 3;
}

function anchorizeTable(node, index, parent, slugger, classifier) {
    const label = getTableLabel(node, index, parent);
    const id = label ? slugger.slug(label) : "";
    parent.children.splice(index, 0,
        html(`<a id="${id}" class="${classifier}" title="${label}" />`)
    );
    return index + 2;
}

const TABLE_LABEL_REGEXP = /<!-- table: (.*) -->/;
const TABLE_LABEL_REGEXP2 = /(.*):(\s|\n|$)/;
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
