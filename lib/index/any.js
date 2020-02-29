const {root, paragraph, text, heading, brk, link, list, listItem } = require("mdast-builder");
const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl, getNodeText} = require("../ast/tools");
const {getIndex, group, byGroupHeading} = require("../indexer");

const api = {};
const REGEXP_ANCHOR_REF   = /<a.*(id|name)="([^"]*)".*\/?>/;
const REGEXP_ANCHOR_CLASS = /<a.*class="([^"]*)".*\/?>/;
const REGEXP_ANCHOR_TITLE = /<a.*title="([^"]*)".*\/?>/;
/**
 * @typedef { import('./model/context') } Context
 * @typedef { import('./indexer').IndexEntry } IndexEntry
 * @typedef { import('./indexer').Index } Index
 */

api.indices = [
    {
        id: "index/html/attr/class"
        ,filterFn: (indexEntry) => {
            const node = indexEntry.node;
            if (node.type === "html" && node.value.match(REGEXP_ANCHOR_REF) && !/href/.test(node.value)) {
                return true;
            }
        }
        ,keyFn: (indexEntry) => {
            const node = indexEntry.node;
            const cssClass = indexEntry.node.value.match(REGEXP_ANCHOR_CLASS)[1];
            if (node.type === "html" && cssClass) {
                return cssClass;
            } else {
                return "unknown";
            }
        }
    }
];

/**
 * Returns the markdown abstract syntax tree that is to be written to an index
 * file configured via 'generateFiles.listOfAny' config.
 *
 * ```
 * <a class="tables" id="articles" title="Table of Articles"></a>
 * | Article ID | Description | Price  |
 * | ---------- | ----------- | ------ |
 * | 12345678   | Football    | $44.50 |
 * ```
 *
 * If an anchor element doesn't have a `title` attribute a title is infered
 * from the `id` attribute
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function(context, outputOpts) {
    const {indexing} = context.opts;
    const {groupByHeadingDepth} = indexing;
    const {title, class: className} = outputOpts;
    const anchors = selectAnchorsFromIndex(className);

    let tree = [
        heading(1, text(title || toFirstUpper(className)))
    ];
    if (! groupByHeadingDepth || groupByHeadingDepth < 0) {
        tree.push(getListOfAnchorsAst(context, anchors, outputOpts));
    } else {
        tree.push(getAnchorsBySectionAst(context, anchors, outputOpts));
    }
    return root(tree);
};

/**
 * @param {Context} context
 * @param {IndexEntry[]} anchors
 */
function getAnchorsBySectionAst(context, anchors, outputOpts) {
    return paragraph(
        group(anchors, byGroupHeading).map((anchors) => {
            const groupHeadingNode = anchors[0].groupHeadingNode;
            if (! groupHeadingNode) {
                return paragraph([
                    getListOfAnchorsAst(context, anchors, outputOpts)
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
                    ,getListOfAnchorsAst(context, anchors, outputOpts)
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
 * @returns {Node} mdast tree
 */
function getListOfAnchorsAst(context, anchors, outputOpts) {
    return list(
        "ordered"
        ,anchors
            .sort((entry1, entry2) => entry1.id - entry2.id)
            .map((indexEntry) => getListOfAnchorsItemAst(context, indexEntry, outputOpts))
    );
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getListOfAnchorsItemAst(context, indexEntry, outputOpts) {
    const outputFile = outputOpts.file;
    let anchor = indexEntry.node.value.match(REGEXP_ANCHOR_REF)[2];
    if (! anchor) {
        anchor = getLinkUrl(indexEntry.headingNode);
    }
    let label = indexEntry.node.value.match(REGEXP_ANCHOR_TITLE)[1];
    if (! label) {
        label = toFirstUpper(anchor);
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
    const anchors = getIndex("index/html/attr/class");
    return anchors[anchorClass] || [];
}

function toFirstUpper(str) {
    return str[0].toUpperCase() + str.substr(1);
}

module.exports = api;
