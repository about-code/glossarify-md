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
 *    byNodeType: { [mdAstNodeType: string]: IndexEntry },
 *    byDefinitionId: { [filenameSharpId: string]: IndexEntry }
 * }} Index
 */

/** @type Index */
const index = {
    byNodeType: {}
    ,byDefinitionId: {}
};
let indexEntryId = 0;

/**
 * Builds an index of nodes by type and an index of definitions by id.
 * The index scope spans accross any visited files.
 *
 * @param {{ context: Context }} opts
 * @returns {(tree: Node, vFile) => Node} mdast transformer
 */
api.indexer = function(opts) {
    const {context} = opts;
    const {groupByHeadingDepth} = context.opts.indexing || 1;
    return (tree, vFile) => {
        const filename = `${vFile.dirname}/${vFile.basename}`;
        uVisit(tree, getNodeVisitor(index, filename, groupByHeadingDepth));
        return tree;
    };
};

/**
 * @param {string} [nodeType] An optional mdAst node type.
 * @returns {Index | IndexEntry[]} Returns the complete node index or an IndexEntry array if a node type was selected.
 */
api.getNodeIndex = function(nodeType) {
    if (nodeType) {
        return index.byNodeType[nodeType] || [];
    } else {
        return index.byNodeType;
    }
};

api.getDefinitionIndex = function() {
    return index.byDefinitionId;
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

/**
 * @param {NodeIndex} nodeIndex
 * @param {DefinitionsIndex} defIndex
 * @param {string} documentFilename
 * @returns {(node: Node) => void}
 */
function getNodeVisitor(index, file, groupByHeadingDepth) {
    const { byNodeType, byDefinitionId} = index;

    // Heading used to (visually) group occurrences in generated index files
    // This might be the section of occurrence or just a page title.
    let lastVisitedGroupHeading = null;
    // Section where to link to in index files (section of occurrence)
    let lastVisitedSectionHeading = null;
    function updateSectionState(node) {
        if (node.type !== "heading") {
            return;
        } else if (node.depth <= 9) {
            // Add table-of-contents hierarchy info to heading nodes.
            // Search parent heading
            let parentHeading = lastVisitedSectionHeading;
            while (parentHeading && node.depth <= parentHeading.depth) {
                parentHeading = parentHeading.parentHeading;
            }
            node.parentHeading = parentHeading;

            if (node.depth <= groupByHeadingDepth)  {
                lastVisitedGroupHeading = node;
            }
            lastVisitedSectionHeading = node;
        }
    }

    return function visitor(node) {
        indexEntryId++;
        updateSectionState(node);
        const indexEntry = {
            id: indexEntryId
            ,node: node
            ,headingNode: lastVisitedSectionHeading
            ,groupHeadingNode: lastVisitedGroupHeading
            ,file: file
        };
        const nodeType = node.type;

        if (! byNodeType[nodeType]) {
            byNodeType[nodeType] = [];
        }
        byNodeType[nodeType].push(indexEntry);

        if (node.type === "definition") {
            byDefinitionId[`${file}#${node.identifier}`] = indexEntry;
        }
    };
}

module.exports = api;
