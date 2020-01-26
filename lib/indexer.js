const uVisit = require("unist-util-visit");
const {getLinkUrl} = require("./ast/tools");
const api = {};

/**
 * @typedef {{
 *    node: Node,
 *    headingNode: Node,
 *    groupHeadingNode: Node,
 *    file: string
 * }} IndexEntry
 *
 * @typedef {{
 *    [indexName: string]: {
 *          [key: string]: IndexEntry
 *    },
 * }} Index
 *
 * @typedef {{
 *    context: Context,
 *    indices: {
 *       id: string,
 *       keyFn: (entry: IndexEntry) => any,
 *       filterFn: (entry: IndexEntry) => boolean
 *    }[]
 * }} Options
 */

/** @type Index */
const _index = {};
let _indexEntryId = 0;

/**
 * Builds an index of nodes by type and an index of definitions by id.
 * The index scope spans accross any visited files.
 * @param {Options} opts
 * @returns {(tree: Node, vFile) => Node} mdast transformer
 */
api.indexer = function(opts) {
    return (tree, vFile) => {
        const filename = `${vFile.dirname}/${vFile.basename}`;
        uVisit(tree, getNodeVisitor(opts, filename));
        return tree;
    };
};

/**
 * @param {Options} opts indexer options
 * @param {string} file currently visited document filename
 * @returns {(node: Node) => void}
 */
function getNodeVisitor(opts, file) {
    const {context} = opts;
    const indices = opts.indices || [];
    const locate = getHeadingNodeLocator(context);
    return function visitor(node) {
        _indexEntryId++;
        const indexEntry = {
            id: _indexEntryId
            ,node: node
            ,headingNode: null
            ,groupHeadingNode: null
            ,file: file
        };
        locate(indexEntry);

        for (let i = 0, len = indices.length; i < len; i++) {
            const idx = indices[i];
            const id = idx.id;
            if (! _index[id]) {
                _index[id] = {};
            }
            if (idx.filterFn.call(null, indexEntry)) {
                const key = idx.keyFn.call(null, indexEntry);
                if (! _index[id][key]) {
                    _index[id][key] = [];
                }
                _index[id][key].push(indexEntry);
            }
        }
    };
}

function getHeadingNodeLocator(context) {
    let {groupByHeadingDepth} = context.opts.indexing;
    let lastVisitedGroupHeading = null;
    let lastVisitedHeading = null;
    if (! groupByHeadingDepth ) {
        groupByHeadingDepth = 9;
    }

    return function locate(indexEntry) {
        const node = indexEntry.node;
        if (node.type === "heading" && node.depth <= 9) {

            // Remember section of current node. Remember section at a depth
            // configured via option 'indexing.groupByHeadingDepth'.
            if (groupByHeadingDepth >= node.depth)  {
                lastVisitedGroupHeading = node;
            }

            // Link heading nodes with their parent nodes visited earlier
            let parentHeading = lastVisitedHeading;
            while (parentHeading && parentHeading.depth >= node.depth) {
                parentHeading = parentHeading.parentHeading;
            }
            node.parentHeading = parentHeading;
            lastVisitedHeading = node;
        }

        indexEntry.headingNode = lastVisitedHeading;
        indexEntry.groupHeadingNode = lastVisitedGroupHeading;
        return indexEntry;
    };
}

api.getIndex = function(indexId) {
    if (Object.prototype.hasOwnProperty.call(_index, indexId)) {
        return _index[indexId];
    }
};

api.getIndexValues = function(indexId, key) {
    const index = api.getIndex(indexId);
    if (index) {
        return index[key] || [];
    } else {
        return [];
    }
};

/**
 * Returns an array of arrays where each `arr[i]` represents a list of index
 * entries and each `arr[i][j]` an `IndexEntry` for some AST node belonging to
 * a document heading used to group the nodes. So all `item[i][j].groupHeadingNode`
 * refer to the same heading AST node.
 *
 * item[i][j].headingNode and each item[i][j] an occurre
 * @returns {Array<Array<IndexEntry>>}
 */
api.groupByHeading = function(indexEntries) {
    const groups = {};
    for (let i = 0, len = indexEntries.length; i < len; i++) {
        const indexEntry = indexEntries[i];
        const groupHeadingNode = indexEntry.groupHeadingNode;
        const anchor = getLinkUrl(groupHeadingNode) || "";
        let pos = "0";
        if (groupHeadingNode) {
            pos = groupHeadingNode.position.start.line;
        }
        const key = `${indexEntry.file}#${pos}:${anchor}`;
        if (! groups[key]) {
            groups[key] = [];
        }
        groups[key].push(indexEntry);
    }
    return Object
        .keys(groups)
        .sort((key1, key2) => key1.localeCompare(key2, "en"))
        .map((key) => {
            return groups[key];
        });
};

module.exports = api;
