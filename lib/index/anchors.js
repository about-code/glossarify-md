/**
 * This module handles indexing of HTML anchors within a markdown AST. HTML
 * anchors may have been created automatically based on a `listOf` configuration
 * (see anchorizer) or may have been provided manually by markdown authors. HTML
 * anchors are indexed *by class*. An anchor class must be encoded as the first
 * segment of a dash-separated HTML 'id' attribute or an HTML 'class' attribute.
 *
 * Exposes functions to get a markdown list AST for a given class of indexed
 * elements. List items will be links which target the indexed element.
 */
import { heading, link, listItem, paragraph, root, text } from "mdast-builder";
import { getHtmlNodeInnerText, getNodeId, getNodeText } from "../ast/tools.js";
import { byGroupHeading, getIndex, group } from "../indexer.js";
import { getFileLinkUrl } from "../path/tools.js";

const brk = text("  \n");
const IDX_ANCHORS = Symbol("anchors");
const REGEXP_ANCHOR_REF   = /<.* (id|name)="([^"]*)".*\/?>/;
const REGEXP_ANCHOR_CLASS = /<.* class="([^"]*)".*\/?>/;
const REGEXP_ANCHOR_TITLE = /<.* title="([^"]*)".*\/?>/;

/**
 * @typedef { import('./model/context') } Context
 * @typedef { import('./indexer').IndexEntry } IndexEntry
 * @typedef { import('./indexer').Index } Index
 * @typedef { {class: string, file: string, title: string} } ConfigOpts
 */
export const indexes = [
    {
        id: IDX_ANCHORS
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
 * Returns a markdown list abstract syntax tree for a given class of indexed
 * elements.
 *
 * *Example:*
 *
 * ```
 * <a class="tables" id="articles" title="Takes precedence">No title attr.</a>
 *
 * | Article ID | Description | Price  |
 * | ---------- | ----------- | ------ |
 * | 12345678   | Football    | $44.50 |
 * ```
 *
 * If an anchor element doesn't have a `class` attribute the `id` attribute is
 * expected to be dash-separated with the first segment denoting the anchor class.
 *
 * If an anchor element doesn't have a `title` attribute nor an inner text then
 * the item label is inferred from the `id` attribute. With a dash-separated
 * `id` attribute the title is inferred from all segments except the first one.
 *
 * @param {Context} context
 * @param {ConfigOpts} outputOpts
 * @returns {Node} mdast tree
 */
export function getAST(context, configOpts) {
    const {indexing} = context.conf;
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
}

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
    return {
        // After upgrading to remark@9.0.0 with micromark we need "spread:false"
        // here to be compatible with the test baseline. Can't use mdast-builder
        // until https://github.com/mike-north/mdast-builder/issues/77 is fixed.
        type: "list"
        ,start: 1
        ,ordered: true
        ,spread: false
        ,children: anchors
            .sort((entry1, entry2) => entry1.id - entry2.id)
            .map((indexEntry) => getListOfAnchorsItemAst(context, indexEntry, configOpts))
    };
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
    let htmlIdAttrMatches = indexEntry.node.value.match(REGEXP_ANCHOR_REF);
    let htmlTitleAttrMatches = indexEntry.node.value.match(REGEXP_ANCHOR_TITLE);
    let htmlId = [];

    // List Item:
    let linkTargetId = "";
    let label = "";

    // Infer list item's link target URL fragment (anchor)
    // 1. Try from html anchor "id" attribute first but cut list classifier
    // prefix if there's any. The html anchor may have been created
    // automatically by anchorizer.
    if (htmlIdAttrMatches) {
        htmlId = htmlIdAttrMatches[2].split("-");
        if (htmlId[0] === anchorClass) {
            htmlId.shift();
        }
        linkTargetId = htmlIdAttrMatches[2];
    }
    // 2. Try id from closest heading. If there's none we can't link a list item
    // to a particular target section but a target file, only.
    if (! linkTargetId && indexEntry.headingNode || htmlId.length === 0) {
        linkTargetId = getNodeId(indexEntry.headingNode);
    }

    // Infer Label
    // 1. try label from "title" attribute
    if (htmlTitleAttrMatches) {
        label = htmlTitleAttrMatches[1];
    }
    // 2. try label from <a>Inner Text</a>
    if (! label) {
        label = getHtmlNodeInnerText(indexEntry.node, indexEntry.parent);
    }
    // 3. try label from "id" attribute
    if (! label && htmlId.length > 0) {
        label = toFirstUpper(htmlId.join(" "));
    }
    // 4. try label from closest heading
    if (! label && indexEntry.headingNode) {
        label = getNodeText(indexEntry.headingNode);
    }
    // 5. Fallback: use target file name as label
    if (! label) {
        label = indexEntry.file;
    }

    return listItem([
        paragraph(link(
            getFileLinkUrl(context, outputFile, indexEntry.file, linkTargetId)
            ,label
            ,text(label)
        ))
    ]);
}
function selectAnchorsFromIndex(anchorClass) {
    const anchors = getIndex(IDX_ANCHORS) || {};
    return anchors[anchorClass] || [];
}

function toFirstUpper(str) {
    if (str) {
        return str[0].toUpperCase() + str.substr(1);
    }
    return str;
}
