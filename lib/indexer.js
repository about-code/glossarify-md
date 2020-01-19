const uVisit = require("unist-util-visit");
const {root, paragraph, text, heading, brk, link } = require("mdast-builder");

const Term = require("./model/term");
const {getFileLinkUrl} = require("./path/tools");
const {getLinkUrl: getMarkdownLinkUrl, getNodeText} = require("./ast/tools");
/**
 * @typedef { import("./model/context") } Context
 * @typedef { import("./ast/tools").Node } Node
 * @typedef {{
 *      definitions: Term[],
 *      occurrences: {[path: string]: Node}
 * }} IndexOldEntry
 * @typedef {{ [term: string]: IndexOldEntry }} IndexOld
 */


/**
 * Module internal state. TODO: Try to replace with state specific to an indexer
 * plug-in execution.
 * @type {Index}
 */
const index = {};
const api = {};

/**
 * Scans the AST for nodes of type `term-occurrence` with term and section
 * information. These are produced by the linker for linkified glossary term
 * occurrences. From those the indexer creates an index structure which is used
 * to generate an index file.
 *
 * @param {{ context: Context }} opts
 * @returns {(tree: Node, vFile) => Node} mdast transformer
 */
api.indexer = function(opts) {
    const {context} = opts;
    const indexFilename = getIndexFilename(context);
    if (! indexFilename) {
        return (tree) => tree;
    } else {
        return (tree, vFile) => {
            const currentDocFilename = `${vFile.dirname}/${vFile.basename}`;
            uVisit(tree, "term-occurrence", getNodeVisitor(context, indexFilename, currentDocFilename));
            return tree;
        };
    }

};

/**
 * @param {Context} context
 * @param {string} fromIndexFile
 * @param {string} toDocumentFile
 * @returns {(node: Node) => void}
 */
function getNodeVisitor(context, fromIndexFile, toDocumentFile) {
    return function visitor(node) {
        const {termDefs, headingNode} = node;
        let headingAnchor;
        if (headingNode) {
            headingAnchor = getMarkdownLinkUrl(headingNode);
        } else {
            headingAnchor = "";
        }


        // Get URL from index file to the section (heading) in which the term was found
        const docRef = getFileLinkUrl(context, fromIndexFile, toDocumentFile, headingAnchor);
        const term = termDefs[0].term;
        if (! index[term]) {
            index[term] = {
                definitions: termDefs
                ,occurrences: {}
            };
        }

        index[term].occurrences[docRef] = { headingNode };
    };
}

/**
 * Returns the filename relative to 'outDir' as given by glossarify-md config
 *
 * @param {Context} context
 * @returns {string}
 */
function getIndexFilename(context) {
    const { indexFile } = context.opts.generateFiles;
    if (indexFile && typeof indexFile === "object") {
        return indexFile.file;
    } else {
        return indexFile;
    }

}

/**
 * Returns the markdown abstract syntax tree that is to be written to the file
 * configured via 'generateFiles.indexFile' config.
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function(context) {
    const {indexFile} = context.opts.generateFiles;
    let title = "";
    let indexFilename = "";
    if (indexFile !== null && typeof indexFile === "object") {
        title = indexFile.title;
        indexFilename = indexFile.file;
    } else {
        indexFilename = indexFile;
    }

    // Create AST from index
    let tree = [
        heading(1, text(title || "Book Index"))
        // Concatenate AST for each index entry
        ,...Object
            .keys(index)
            .sort()
            .map((key) => getIndexEntryAst(context, index[key], indexFilename))
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
function getIndexEntryAst(context, indexEntry, indexFilename) {
    const txtTerm = indexEntry.definitions[0].term;
    return paragraph([
        heading(2, text(txtTerm))
        ,brk
        ,brk
        ,...getEntryLinksAst(context, indexEntry, indexFilename)
    ]);
}

/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {string} indexFilename
 */
function getEntryLinksAst(context, indexEntry, indexFilename) {
    const links = [
        ...getGlossaryLinksAst(context, indexEntry, indexFilename)
        ,...getDocumentLinksAst(context, indexEntry)
    ];
    const linksSeparated = [];
    for (let i = 0, len = links.length; i < len; i++) {
        if (i > 0) {
            linksSeparated.push(text(" - "));
        } // link separator

        linksSeparated.push(links[i]);
    }
    return linksSeparated;
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {string} fromIndexFilename
 * @returns {Node} mdast Node
 */
function getGlossaryLinksAst(context, indexEntry, fromIndexFilename) {
    return indexEntry.definitions
        .sort(Term.compare)
        .map((term) => {
            const toGlossaryFilename =  term.glossary.outPath;
            const url = getFileLinkUrl(context, fromIndexFilename, toGlossaryFilename, term.anchor);
            return link(url, term.getShortDescription(), text(term.glossary.title));
        });
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getDocumentLinksAst(context, indexEntry) {
    return Object
        .keys(indexEntry.occurrences)
        .sort() // [1]
        .map((ref) => {
            const {headingNode} = indexEntry.occurrences[ref];
            let linkText;
            if (headingNode) {
                linkText = getNodeText(headingNode);
            } else {
                linkText = ref;
            }

            return link(ref, null, text(linkText));
        });

    // Implementation Notes:
    // [1]: sort to gain reproducable results accross OS platforms
}

// ------------------------------- Indexer 2 -----------------------------------

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
 *    byHeadingId: { [filenameSharpId: string]: IndexEntry},
 *    byDefinitionId: { [filenameSharpId: string]: IndexEntry }
 * }} Index
 */

/** @type Index */
const index2 = {
    byNodeType: {}
    ,byHeadingId: {}
    ,byDefinitionId: {}
};
/**
 * Builds an index of nodes by type and an index of definitions by id.
 * The index scope spans accross any visited files.
 *
 * @param {{ context: Context }} opts
 * @returns {(tree: Node, vFile) => Node} mdast transformer
 */
api.indexer2 = function(opts) {
    const {context} = opts;
    const {groupByHeadingDepth} = context.opts.indexing || 1;
    return (tree, vFile) => {
        const filename = `${vFile.dirname}/${vFile.basename}`;
        uVisit(tree, getNodeVisitor2(index2, filename, groupByHeadingDepth));
        return tree;
    };
};

/**
 * @param {string} [nodeType] An optional mdAst node type.
 * @returns {Index | IndexEntry[]} Returns the complete node index or an IndexEntry array if a node type was selected.
 */
api.getNodeIndex = function(nodeType) {
    if (nodeType) {
        return index2.byNodeType[nodeType] || [];
    } else {
        return index2.byNodeType;
    }
};

api.getByHeadingId = function() {
    return index2.byHeadingId;
};

api.getDefinitionIndex = function() {
    return index2.byDefinitionId;
};

/**
 * @param {NodeIndex} nodeIndex
 * @param {DefinitionsIndex} defIndex
 * @param {string} documentFilename
 * @returns {(node: Node) => void}
 */
function getNodeVisitor2(index, file, groupByHeadingDepth) {
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
        updateSectionState(node);
        const indexEntry = {
            node: node
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

        /*
        const headingId = `${file}#${getMarkdownLinkUrl(lastVisitedSectionHeading)}`;
        if (! byHeadingId[headingId]) {
            byHeadingId[headingId] = [];
        }
        byHeadingId[headingId].push(indexEntry);
        */
    };
}

module.exports = api;
