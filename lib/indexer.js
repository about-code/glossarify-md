import { visit } from "unist-util-visit";
import { IndexEntry } from "./model/indexEntry.js";
import { getVFilePath, relativeFromTo } from "./path/tools.js";
import { collator } from "./text/collator.js";
import { pad } from "./text/tools.js";

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
 * Builds up indices from the `indices` configuration provided in `args`.
 *
 * @param {Options} args
 * @returns {(tree: Node, vFile) => Node} mdast transformer
 */
export function indexer(args) {
    return (tree, vFile) => {
        visit(tree, getNodeVisitor(args, vFile));
        return tree;
    };
}

/**
 * Returns the visitor that visits and indexes all the nodes of an AST according
 * to the `indices` indexer option.
 *
 * @param {Options} args indexer options
 * @param {string} vFile currently visited document filename
 * @returns {(node: Node) => void}
 */
function getNodeVisitor(args, vFile) {
    const context = args.context;
    const indices = args.indexes || [];
    const { baseDir, ignoreCase, indexing} = context.conf;

    const searchExprFlags = `u${ignoreCase ? "i": ""}`;
    const getLastHeadingsVisited = memoizeHeadingsVisited(indexing.groupByHeadingDepth);

    return function visitor(node, idx, parent) {
        const {lastHeadingVisited, lastGroupHeadingVisited} = getLastHeadingsVisited(node);
        _indexEntryId++;

        // Indexing...
        for (let i = 0, len = indices.length; i < len; i++) {
            const idx = indices[i];
            const id = idx.id;
            if (! _index[id]) {
                _index[id] = {};
            }
            if (idx.filterFn.call(null, node, vFile, context)) {
                const key = idx.keyFn.call(null, node, vFile, context);
                if (! _index[id][key]) {
                    _index[id][key] = [];
                }
                _index[id][key].push(
                    new IndexEntry({
                        id: _indexEntryId
                        ,node: node
                        ,file: relativeFromTo(baseDir, getVFilePath(vFile), baseDir)
                        ,parent: parent
                        ,headingNode: lastHeadingVisited
                        ,groupHeadingNode: lastGroupHeadingVisited
                        ,searchExpr: idx.searchExpr
                            ? idx.searchExpr.call(null, node, vFile, context, searchExprFlags)
                            : null
                    })
                );
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
function memoizeHeadingsVisited(groupByHeadingDepth) {
    let memo = {
        lastGroupHeadingVisited: null
        , lastHeadingVisited: null
    };
    return function memoizer(node) {
        if (node.type !== "heading" || node.depth > 6) {
            return memo;
        }
        // Remember section of current node. Remember section at a depth
        // configured via option 'indexing.groupByHeadingDepth'.
        if (groupByHeadingDepth >= node.depth)  {
            memo.lastGroupHeadingVisited = node;
        } else if (groupByHeadingDepth === 0 && node.depth === 1) {
            memo.lastGroupHeadingVisited = node;
        }
        // Link heading nodes with their parent nodes visited earlier
        let parentHeading = memo.lastHeadingVisited;
        while (parentHeading && parentHeading.depth >= node.depth) {
            parentHeading = parentHeading.parentHeading;
        }
        node.parentHeading = parentHeading;
        memo.lastHeadingVisited = node;
        return memo;
    };
}

/**
 * @param {string} indexId Id of an index as has been passed with `args` to `indexer(args)`
 */
export function getIndex(indexId) {
    if (Object.prototype.hasOwnProperty.call(_index, indexId)) {
        return _index[indexId];
    } else {
        return {};
    }
}

/**
 * @param {string} indexId Id of an index as has been passed with `args` to `indexer(args)`
 * @param {string} key particular index key
 * @returns {IndexEntry[]} index entries mapped onto key or empty array.
 */
export function getIndexValues(indexId, key) {
    const index = getIndex(indexId);
    if (index) {
        return index[key] || [];
    } else {
        return [];
    }
}

/**
 * Returns a two-dimensional array `arr[groupKey][i]` where each `arr[groupKey]`
 * represents an array of IndexEntrys i that share some common group key. Each
 * IndexEntry represents and refers to some particular "indexed" mdAST node.
 *
 * The key to group by may be derived by some function `byGroupKeyFn`. If no such
 * argument is provided, IndexEntrys are grouped by their `groupHeadingNode`.
 * This is an mdAST `heading` node type. More precisely they are grouped by
 * the heading node's *identifier*. For heading nodes to be identifiable, a
 * remark plug-in might be required, such as 'remark-slug' or a custom ones.
 *
 * The `groupHeadingNode` may be a `heading` node that is "deepest" (`depth`)
 * and therefore closest to the indexed node. But it may also be some parent
 * heading that is less close. The group heading depths is configurable by
 * glossarify-md's `indexing.groupByHeadingDepth` config option.
 *
 * @param {IndexEntry[]} indexEntries Index entries to group by their `groupHeadingNode`
 * @param {(IndexEntry) => string} [byGroupKeyFn] Function returning the key value to group by. If missing groups by `groupHeadingNode`
 * @returns {Array<IndexEntry[]>}
 */
export function group(indexEntries, byGroupKeyFn) {
    const groups = {};
    for (let i = 0, len = indexEntries.length; i < len; i++) {
        const indexEntry = indexEntries[i];
        let key = null;
        if (! byGroupKeyFn) {
            key = byGroupHeading(indexEntry);
        } else {
            key = byGroupKeyFn.call(null, indexEntry);
        }
        if (! groups[key]) {
            groups[key] = [];
        }
        groups[key].push(indexEntry);
    }
    return Object
        .keys(groups)
        .sort((key1, key2) => collator.compare(key1, key2))
        .map((key) => {
            return groups[key];
        });
}

/**
 * Group key function to use with `group(indexEntries, groupKeyFn)`
 * in order to group index entries by their `groupHeadingNode`.
 */
export function byGroupHeading(indexEntry) {
    const groupHeadingNode = indexEntry.groupHeadingNode;
    let pos = pad("0", "0", -6);
    if (groupHeadingNode) {
        // Left-Pad required because group() will sort lexicographically
        // by group key. Without padding 'file.md#11' would sort before
        // 'file.md#2';
        pos = pad(groupHeadingNode.position.start.line, "0", -6);
    }
    // return key
    return `${indexEntry.file}#${pos}`;
}
