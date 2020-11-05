const {root, paragraph, text, heading, brk, link, list, listItem } = require("mdast-builder");
const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl, getNodeText, getHtmlNodeInnerText} = require("../ast/tools");
const {getIndex, group, byGroupHeading} = require("../indexer");

const api = {};
const REGEXP_ANCHOR_REF   = /<a .*(id|name)="([^"]*)".*\/?>/;
const REGEXP_ANCHOR_CLASS = /<a .*class="([^"]*)".*\/?>/;
const REGEXP_ANCHOR_TITLE = /<a .*title="([^"]*)".*\/?>/;

/**
 * @typedef { import('./model/context') } Context
 * @typedef { import('./indexer').IndexEntry } IndexEntry
 * @typedef { import('./indexer').Index } Index
 * @typedef { {class: string, file: string, title: string} } ConfigOpts
 */

api.indices = [
    {
        id: "index/anchors"
        ,filterFn: (node) => {
            if (node.type === "html" && node.value.match(REGEXP_ANCHOR_REF) && !/href/.test(node.value)) {
                return true;
            }
        }
        ,keyFn: (node) => {
            const htmlNodeValue = node.value;
            let matchClass = htmlNodeValue.match(REGEXP_ANCHOR_CLASS);
            let anchorClass = "";
            if (matchClass) {
                anchorClass = matchClass[1];
            } else {
                // Fallback: there's no CSS class attribute <a class="" >.
                // Try infer class from id-prefix <a id="prefix-xy">
                matchClass = htmlNodeValue.match(REGEXP_ANCHOR_REF);
                if (matchClass) {
                    anchorClass = matchClass[2].split("-")[0];
                }
            }
            return anchorClass || "unknown";
        }
    }
];

/**
 * Returns the markdown abstract syntax tree that is to be written to an index
 * file configured via 'generateFiles.listOf' config.
 *
 * ```
 * <a class="tables" id="articles" title="Table of Articles"></a>
 *
 * | Article ID | Description | Price  |
 * | ---------- | ----------- | ------ |
 * | 12345678   | Football    | $44.50 |
 * ```
 *
 * If an anchor element doesn't have a `title` attribute a title is infered
 * from the `id` attribute
 *
 * @param {Context} context
 * @param {ConfigOpts} outputOpts
 * @returns {Node} mdast tree
 */
api.getAST = function(context, configOpts) {
    const {indexing} = context.opts;
    const {groupByHeadingDepth} = indexing;
    const {title, class: className} = configOpts;
    const anchors = selectAnchorsFromIndex(className);

    let tree = [
        heading(1, text(title || toFirstUpper(className)))
    ];
    if (! groupByHeadingDepth || groupByHeadingDepth < 0) {
        tree.push(getListOfAnchorsAst(context, anchors, configOpts));
    } else {
        tree.push(getAnchorsBySectionAst(context, anchors, configOpts));
    }
    return root(tree);
};

/**
 * @param {Context} context
 * @param {ConfigOpts} configOpts
 * @param {IndexEntry[]} anchors
 */
function getAnchorsBySectionAst(context, anchors, configOpts) {
    return paragraph(
        group(anchors, byGroupHeading).map((anchors) => {
            const groupHeadingNode = anchors[0].groupHeadingNode;
            if (! groupHeadingNode) {
                return paragraph([
                    getListOfAnchorsAst(context, anchors, configOpts)
                    ,brk
                ]);
            } else {
                return paragraph([
                    brk
                    ,heading(groupHeadingNode.depth + 1, // [1]
                        text(getNodeText(groupHeadingNode))
                    )
                    ,brk
                    ,brk
                    ,getListOfAnchorsAst(context, anchors, configOpts)
                    ,brk
                ]);
            }
        })
    );
    /**
     * Implementation Notes:
     *
     * [1] add +1 to depth of headings referred to in order to keep
     * the title of the generated file the only depth-1 heading
     */
}

/**
 * @param {Context} context
 * @param {IndexEntry[]} anchors
 * @param {ConfigOpts} configOpts
 * @returns {Node} mdast tree
 */
function getListOfAnchorsAst(context, anchors, configOpts) {
    return list(
        "ordered"
        ,anchors
            .sort((entry1, entry2) => entry1.id - entry2.id)
            .map((indexEntry) => getListOfAnchorsItemAst(context, indexEntry, configOpts))
    );
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {ConfigOpts} configOpts
 * @returns {Node} mdast tree
 */
function getListOfAnchorsItemAst(context, indexEntry, configOpts) {
    const outputFile = configOpts.file;
    const anchorClass = configOpts.class;
    let idMatches = indexEntry.node.value.match(REGEXP_ANCHOR_REF);
    let titleMatches = indexEntry.node.value.match(REGEXP_ANCHOR_TITLE);
    let anchor = "";
    let anchorId = [];
    let label = "";

    // Infer URL anchor fragment
    // try anchor from "id" attribute but split away ambiguous id prefix
    if (idMatches) {
        anchorId = idMatches[2].split("-");
        if (anchorId[0] === anchorClass) {
            anchorId.shift();
        }
        anchor = idMatches[2];
    }
    // try anchor from closest heading or none at all
    if (! anchor && indexEntry.headingNode || anchorId.length === 0) {
        anchor = getLinkUrl(indexEntry.headingNode);
    }

    // Infer Label
    // try label from "title" attribute
    if (titleMatches) {
        label = titleMatches[1];
    }
    // try label from <a>Inner Text</a>
    if (! label) {
        label = getHtmlNodeInnerText(indexEntry.node, indexEntry.parent);
    }
    // try label from "id" attribute
    if (! label && anchorId.length > 0) {
        label = toFirstUpper(anchorId.join(" "));
    }
    // try label from closest heading
    if (! label && indexEntry.headingNode) {
        label = getNodeText(indexEntry.headingNode);
    }
    // Fallback: use target file name as label
    if (! label) {
        label = indexEntry.file;
    }

    return listItem([
        link(
            getFileLinkUrl(context, outputFile, indexEntry.file, anchor)
            ,label
            ,text(label)
        )
    ]);
}
function selectAnchorsFromIndex(anchorClass) {
    const anchors = getIndex("index/anchors") || {};
    return anchors[anchorClass] || [];
}

function toFirstUpper(str) {
    if (str) {
        return str[0].toUpperCase() + str.substr(1);
    }
    return str;
}

module.exports = api;
