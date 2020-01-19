const {root, paragraph, text, heading, brk, link, list, listItem } = require("mdast-builder");

const {getFileLinkUrl} = require("./path/tools");
const {getLinkUrl} = require("./ast/tools");
const {getNodeIndex, getDefinitionIndex} = require("./indexer");


/**
 * Module internal state. TODO: Try to replace with state specific to an indexer
 * plug-in execution.
 * @type {Index}
 */
const api = {};

/**
 * Returns the markdown abstract syntax tree that is to be written to the file
 * configured via 'generateFiles.indexFile' config.
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function(context) {
    const {listOfFigures} = context.opts.generateFiles;
    const {title} = listOfFigures;
    const figures = getFiguresFromIndex(context);

    // Create AST from index
    const tree = [
        heading(1, text(title || "Figures"))
        ,paragraph(getListOfFiguresAst(context, figures))
    ];
    return root(tree);
};


/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {string} indexFilename
 * @returns {Node} mdast tree
 */
function getListOfFiguresAst(context, figures) {
    return list(
        "ordered"
        ,figures
            .sort(sortByFile)
            .map((nodeIndexEntry) => getListOfFiguresItemAst(context, nodeIndexEntry))
    );
}

function getListOfFiguresItemAst(context, nodeIndexEntry) {
    const {listOfFigures} = context.opts.generateFiles;
    const {file: listOfFiguresFile} = listOfFigures;

    return listItem([
        link(
            getFileLinkUrl(context, listOfFiguresFile, nodeIndexEntry.file, getLinkUrl(nodeIndexEntry.headingNode))
            ,nodeIndexEntry.node.title
            ,text(nodeIndexEntry.node.alt)
        )
    ]);
}

/**
 * @param {Context} context
 * @returns {NodeIndexEntry[]} index entries for node types "image" and "imageReference"
 */
function getFiguresFromIndex(context) {
    const nodeIndex = getNodeIndex();
    const defIndex  = getDefinitionIndex();
    let figures = []
    if (nodeIndex["image"]) {
        figures = [
            ... nodeIndex["image"]
        ];
    }
    if (nodeIndex["imageReference"]) {
        figures = [
            ...figures
            ,...nodeIndex["imageReference"].map((refItem) => {
                // dereference
                const node = refItem.node;
                const file = refItem.file;
                const def = defIndex[`${file}#${node.identifier}`];
                refItem.node = {
                    ...refItem.node
                    , type: "image"
                    , url: def.url
                    , title : def.title
                };
                return refItem;
            })
        ];
    }
    return figures;
}

function sortByFile(nodeIndexItem1, nodeIndexItem2) {
    return nodeIndexItem1.url.localeCompare(nodeIndexItem2.url);
}

module.exports = api;
