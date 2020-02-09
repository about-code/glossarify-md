const {root, paragraph, text, heading, brk, link, list, listItem } = require("mdast-builder");

const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl, getNodeText} = require("../ast/tools");
const {getIndex, getIndexValues: getValues, group, byGroupHeading} = require("../indexer");

const api = {};

/**
 * @typedef { import('./model/context') } Context
 * @typedef { import('./indexer').IndexEntry } IndexEntry
 * @typedef { import('./indexer').Index } Index
 */

api.indices = [
    {
        id: "index/figures/nodeType/image"
        ,keyFn:    (indexEntry) => indexEntry.node.type
        ,filterFn: (indexEntry) => {
            const t = indexEntry.node.type;
            return t === "image" || t === "imageReference";
        }
    }
    ,{
        id: "index/figures/nodeType/definition"
        ,keyFn:    (entry) => `${entry.file}#${entry.node.identifier}`
        ,filterFn: (entry) => entry.node.type === "definition"
    }
];

/**
 * Returns the markdown abstract syntax tree that is to be written to the file
 * configured via 'generateFiles.indexFile' config.
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function(context) {
    const {generateFiles, indexing} = context.opts;
    const {groupByHeadingDepth} = indexing;
    const {title} = generateFiles.listOfFigures;
    const figures = selectFiguresFromIndex(context);

    let tree = [
        heading(1, text(title || "Figures"))
    ];
    if (! groupByHeadingDepth || groupByHeadingDepth < 0) {
        tree.push(getListOfFiguresAst(context, figures));
    } else {
        tree.push(getFiguresBySectionAst(context, figures));
    }
    return root(tree);
};

/**
 * @param {Context} context
 * @param {IndexEntry[]} figures
 */
function getFiguresBySectionAst(context, figures) {
    return paragraph(
        group(figures, byGroupHeading).map((figures) => {
            const groupHeadingNode = figures[0].groupHeadingNode;
            return paragraph([
                brk
                ,heading(groupHeadingNode.depth + 1, // [1]
                    text(getNodeText(groupHeadingNode))
                )
                ,brk
                ,brk
                ,getListOfFiguresAst(context, figures)
                ,brk
            ]);
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
 * @param {IndexEntry[]} figures
 * @returns {Node} mdast tree
 */
function getListOfFiguresAst(context, figures) {
    return list(
        "ordered"
        ,figures
            .sort((entry1, entry2) => entry1.id - entry2.id)
            .map((indexEntry) => getListOfFiguresItemAst(context, indexEntry))
    );
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getListOfFiguresItemAst(context, indexEntry) {
    const {listOfFigures} = context.opts.generateFiles;
    const {file: listOfFiguresFile} = listOfFigures;

    return listItem([
        link(
            getFileLinkUrl(context, listOfFiguresFile, indexEntry.file, getLinkUrl(indexEntry.headingNode))
            ,indexEntry.node.title
            ,text(indexEntry.node.alt)
        )
    ]);
}

/**
 * @returns {IndexEntry[]} index entries for node types "image" and "imageReference"
 */
function selectFiguresFromIndex() {
    const images    = getValues("index/figures/nodeType/image", "image");
    const imageRefs = getValues("index/figures/nodeType/image", "imageReference");
    const defIndex  = getIndex("index/figures/nodeType/definition");
    let figures = [
        ...images
        ,...imageRefs.map((indexEntry) => {
            // dereference
            const refFile = indexEntry.file;
            const refNode = indexEntry.node;
            const defId = `${refFile}#${refNode.identifier}`;
            const defNode = defIndex[defId][0].node;
            indexEntry.node = {
                ...indexEntry.node
                , type: "image"
                , url: defNode.url
                , title : defNode.title
            };
            return indexEntry;
        })
    ];
    return figures;
}

module.exports = api;
