const uVisit = require("unist-util-visit");
const {getLinkUrl: getMarkdownLinkUrl} = require("./ast/tools");
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
 */

/** @type Index */
const _index = {};
let _indexEntryId = 0;

/**
 * Builds an index of nodes by type and an index of definitions by id.
 * The index scope spans accross any visited files.
 *
 * @param {{ context: Context }} opts
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
            if (idx.filterFn.call(null, indexEntry)) {
                const key = idx.keyFn.call(null, indexEntry);
                if (! _index[id]) {
                    _index[id] = {};
                }
                if (! _index[id][key]) {
                    _index[id][key] = [];
                }
                _index[id][key].push(indexEntry);
            }
        }
    };
}

function getHeadingNodeLocator(context) {
    const {groupByHeadingDepth} = context.opts.indexing || 1;

    let lastVisitedGroupHeading = null;
    let lastVisitedHeading = null;

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

api.groupByHeading = function(indexEntries) {
    const groups = {};
    for (let i = 0, len = indexEntries.length; i < len; i++) {
        const indexEntry = indexEntries[i];
        const key = `${indexEntry.file}#${getMarkdownLinkUrl(indexEntry.groupHeadingNode)}`;
        if (! groups[key]) {
            groups[key] = [];
        }
        groups[key].push(indexEntry);
    }
    return Object
        .keys(groups)
        .sort((key1, key2) => {
            const entry1 = groups[key1][0];
            const entry2 = groups[key2][0];
            const ghn1 = entry1.groupHeadingNode;
            const ghn2 = entry2.groupHeadingNode;
            if (ghn1 && ghn2) {
                return ghn1.depth - ghn2.depth;
            } else {
                return entry1.id - entry2.id;
            }
        })
        .map((key) => {
            return groups[key];
        });
};

module.exports = api;
