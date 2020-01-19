const {root, paragraph, text, heading, brk, link, list, listItem } = require("mdast-builder");

const {getFileLinkUrl, relativeFromTo} = require("./path/tools");
const {getLinkUrl, getNodeText} = require("./ast/tools");
const {getNodeIndex, getDefinitionIndex} = require("./indexer");

const api = {};

/**
 * @typedef { import('./model/context') } Context
 * @typedef { import('./indexer').IndexEntry } IndexEntry
 * @typedef { import('./indexer').Index } Index
 */

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
    const sections = {};
    for (let i = 0, len = figures.length; i < len; i++) {
        const indexEntry = figures[i];
        const key = `${indexEntry.file}#${getLinkUrl(indexEntry.groupHeadingNode)}`
        if (! sections[key]) {
            sections[key] = [];
        }
        sections[key].push(indexEntry);
    }

    return paragraph(
        Object
            .keys(sections)
            .map((key) => {
                const indexEntries = sections[key];
                const groupHeadingNode = indexEntries[0].groupHeadingNode;
                return paragraph([
                    // add +1 to depth of headings referred to in order to keep
                    // the title of the generated file the only depth-1 heading
                    brk
                    ,heading(groupHeadingNode.depth + 1, text(getNodeText(groupHeadingNode)))
                    ,brk
                    ,brk
                    ,getListOfFiguresAst(context, indexEntries)
                    ,brk
                ]);
            })
    );
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
            .sort(sortByFile)
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
    const images    = getNodeIndex("image");
    const imageRefs = getNodeIndex("imageReference");
    const defIndex  = getDefinitionIndex();
    let figures = [
        ...images
        ,...imageRefs.map((indexEntry) => {
                // dereference
                const refFile = indexEntry.file;
                const refNode = indexEntry.node;
                const defId = `${refFile}#${refNode.identifier}`;
                const defNode = defIndex[defId].node;
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

/**
 *
 * @param {IndexEntry} indexEntry1
 * @param {IndexEntry} indexEntry2
 */
function sortByFile(indexEntry1, indexEntry2) {
    return indexEntry1.node.url.localeCompare(indexEntry2.node.url);
}

module.exports = api;
