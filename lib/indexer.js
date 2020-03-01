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
 * Builds up indices from the `indices` configuration provided with `opts`.
 *
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
 * Returns the visitor that visits and indexes all the nodes of an AST according
 * to the `indices` indexer option.
 *
 * @param {Options} opts indexer options
 * @param {string} file currently visited document filename
 * @returns {(node: Node) => void}
 */
function getNodeVisitor(opts, file) {
    const {context} = opts;
    const indices = opts.indices || [];
    const setHeadingNodes = getHeadingNodesSetter(context);
    return function visitor(node, idx, parent) {
        _indexEntryId++;
        const indexEntry = {
            id: _indexEntryId
            ,node: node
            ,file: file
            ,parent: parent
            ,headingNode: null
            ,groupHeadingNode: null
        };
        setHeadingNodes(indexEntry);

        // Indexing...
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

/**
 * Returns a function which takes an indexEntry and sets its `headingNode`
 * and `groupHeadingNode` nodes based on the last visited heading nodes.

 * ### Group Heading Node vs. Heading Node
 *
 * The `groupHeadingNode` depends on the configuration option
 * `indexing.groupByHeadingDepth` and is the last visited heading node with a
 * depth less or equal to `groupByHeadingDepth`. The group headings are used
 * to decide the level of detail for rendering where some indexed item can be
 * found in a book. For example users tell with a group heading depth of 1
 * that they are interested only in the chapters where some indexed markdown
 * element can be found but not necessarily the exact section. Nevertheless
 * a reference to the exact section will also be stored with an index entry in
 * `headingNode`.
 *
 * @param {Context} context
 */
function getHeadingNodesSetter(context) {
    let {groupByHeadingDepth} = context.opts.indexing;
    let lastVisitedGroupHeading = null;
    let lastVisitedHeading = null;
    return function setter(indexEntry) {
        const node = indexEntry.node;
        if (node.type === "heading" && node.depth <= 6) {

            // Remember section of current node. Remember section at a depth
            // configured via option 'indexing.groupByHeadingDepth'.
            if (groupByHeadingDepth >= node.depth)  {
                lastVisitedGroupHeading = node;
            } else if (groupByHeadingDepth === 0 && node.depth === 1) {
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

/**
 * @param {string} indexId Id of an index as has been passed with `opts` to `indexer(opts)`
 */
api.getIndex = function(indexId) {
    if (Object.prototype.hasOwnProperty.call(_index, indexId)) {
        return _index[indexId];
    }
};

/**
 * @param {string} indexId Id of an index as has been passed with `opts` to `indexer(opts)`
 * @param {string} key particular index key
 * @returns {IndexEntry[]} index entries mapped onto key or empty array.
 */
api.getIndexValues = function(indexId, key) {
    const index = api.getIndex(indexId);
    if (index) {
        return index[key] || [];
    } else {
        return [];
    }
};

/**
 * Returns an array where each `arr[i]` represents another array of index
 * entries that share the same group heading. Each `arr[i][j]` is an `IndexEntry`
 * for some AST node where `item[i][j].groupHeadingNode` is the same heading AST
 * node for every j at a given i.
 *
 * @param {IndexEntry[]} indexEntries Index entries to group by their `groupHeadingNode`
 * @param {(IndexEntry) => string} [groupKeyFn] Function returning the key value to group by. If missing groups by `groupHeadingNode`
 * @returns {Array<IndexEntry[]>}
 */
api.group = function(indexEntries, groupKeyFn) {
    const groups = {};
    for (let i = 0, len = indexEntries.length; i < len; i++) {
        const indexEntry = indexEntries[i];
        let key = null;
        if (! groupKeyFn) {
            key = api.byGroupHeading(indexEntry);
        } else {
            key = groupKeyFn.call(null, indexEntry);
        }
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

/**
 * Group key function to use with `group(indexEntries, groupKeyFn)`
 * in order to group index entries by their `groupHeadingNode`.
 */
api.byGroupHeading = function(indexEntry) {
    const groupHeadingNode = indexEntry.groupHeadingNode;
    const anchor = getLinkUrl(groupHeadingNode) || "";
    let pos = "0";
    if (groupHeadingNode) {
        pos = groupHeadingNode.position.start.line;
    }
    // return key
    return `${indexEntry.file}#${pos}:${anchor}`;
};

module.exports = api;
