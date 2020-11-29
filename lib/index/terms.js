const {root, paragraph, text, heading, brk, link, html} = require("mdast-builder");

const {Term} = require("../model/term");
const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl, getNodeText} = require("../ast/tools");
const {getIndex, group, byGroupHeading} = require("../indexer");

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
const api = {
    IDX_TERM_OCCURRENCES: "term-occ"
    ,IDX_TERM_DEFINITIONS_BY_TERM: "byTerm"
    ,IDX_TERM_DEFINITIONS: "terms"
};
api.indices = [
    {
        id: api.IDX_TERM_OCCURRENCES
        ,title: "Book Index"
        ,filterFn: (node) => node.type === "term-occurrence"
        ,keyFn:    (node) => node.value
        ,conf:     (context) => {
            const {generateFiles} = context.opts;
            const {indexFile} = generateFiles;
            return indexFile;
        }
    }
    ,{
        id: api.IDX_TERM_DEFINITIONS
        ,title: "Glossary"
        ,filterFn: (node) => node.type === "term"
        ,keyFn: () => 0
        ,sortFn: (indexEntry1, indexEntry2) => Term.compare(indexEntry1.node, indexEntry2.node)
        ,conf: () => null
    }
    ,{
        id: api.IDX_TERM_DEFINITIONS_BY_TERM
        ,title: "Glossary"
        ,filterFn: (node) => node.type === "term"
        ,keyFn: (node) => node.anchor
        ,sortFn: (indexEntry1, indexEntry2) => Term.compare(indexEntry1.node, indexEntry2.node)
        ,conf: () => null
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
    const indexDescriptor = api.indices[0];
    const indexConf = indexDescriptor.conf(context);
    const indexEntries = getIndex(api.IDX_TERM_OCCURRENCES);

    let title = "";
    if (indexConf !== null && typeof indexConf === "object") {
        title = indexConf.title;
    }
    if (!title) {
        title = indexDescriptor.title;
    }

    // Create AST from index
    let tree = [
        heading(1, text(title))
        // Concatenate AST for each index entry
        ,...indexEntries
            .map(indexEntrySet => getIndexEntryAst(context, indexEntrySet))
    ];
    return root(tree);
};

/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntrySet
 * @param {string} indexFilename
 * @returns {Node} mdast tree
 */
function getIndexEntryAst(context, indexEntrySet) {
    const key = getNodeText(indexEntrySet.one().node);
    return paragraph([
        heading(2, text(key))
        ,brk
        ,brk
        ,...getEntryLinksAst(context, indexEntrySet)
    ]);
}

/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {string} indexFilename
 */
function getEntryLinksAst(context, indexEntrySet) {
    const indexFilename = getIndexFilename(context);
    const byHeadings = indexEntrySet.group(byGroupHeading);
    const links = [
        ...getGlossaryLinksAst(context, indexEntrySet, indexFilename)
        ,...getDocumentLinksAst(context, byHeadings, indexFilename)
    ];
    const linksSeparated = [];
    for (let i = 0, len = links.length; i < len; i++) {
        if (i > 0) {
            linksSeparated.push(text(" \u25cb "));
        }
        linksSeparated.push(links[i]);
    }
    return linksSeparated;
}

/**
 * @param {Context} context
 * @param {Set<IndexEntry>} indexEntrySet
 * @param {string} fromIndexFilename
 * @returns {Node} mdast Node
 */
function getGlossaryLinksAst(context, indexEntrySet, fromIndexFilename) {
    return indexEntrySet.one().node.termDefs
        .map((indexEntry) => {
            const termNode = indexEntry.node;
            const toGlossaryFilename =  termNode.glossary.outPath;
            const url = getFileLinkUrl(context, fromIndexFilename, toGlossaryFilename, termNode.anchor);
            return link(url, termNode.getShortDescription(), text(termNode.glossary.title));
        });
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getDocumentLinksAst(context, indexEntrySetByHeadings, fromIndexFilename) {
    return indexEntrySetByHeadings
        .map(group => group[1])
        .map(indexEntryOccurrences => {
            const indexEntry = indexEntryOccurrences[0]; // [1]
            const headingNode = indexEntry.groupHeadingNode;
            const toDocumentFilename = indexEntry.file;
            const anchor = getLinkUrl(headingNode);
            const termNode = indexEntry.node.termDefs.one().node;
            const ref = getFileLinkUrl(context, fromIndexFilename, toDocumentFilename, anchor);
            let linkText;
            if (headingNode) {
                linkText = getNodeText(headingNode);
            } else {
                linkText = ref;
            }
            if (linkText === termNode.glossary.title) {
                // prevent duplicate listing of glossary title (see also getGlossaryLinksAst())
                return null;
            } else {
                const occurrencesAst = getLinksToOccurrenceAst(context, fromIndexFilename, indexEntryOccurrences);
                if (occurrencesAst.length === 0) {
                    return link(ref, null, text(linkText));
                } else {
                    return paragraph([
                        link(ref, null, text(linkText))
                        ,html("<sub> ")
                        ,...occurrencesAst
                        ,html("</sub>")
                    ]);
                }
            }
        })
        .filter(linkNode => linkNode !== null);
    // Implementation Notes:
    // [1]: We get the index entries for all occurrences of a particular term
    // below the given heading. Since we can only link to the heading but not
    // each particular term position we can derive the heading link from the
    // first term occurrence, solely.
}

function getLinksToOccurrenceAst(context, fromIndexFilename, indexEntries) {
    let {groupByHeadingDepth} = context.opts.indexing;
    let i = 1;
    return group(indexEntries, byHeading)
        .map((entriesByHeading) => {
            const { headingNode, file } = entriesByHeading[0];
            if (headingNode && headingNode.depth > groupByHeadingDepth) {
                const anchor = getLinkUrl(headingNode);
                const ref = getFileLinkUrl(context, fromIndexFilename, file, anchor);
                return link(ref, getNodeText(headingNode), text(`${i++} `));
            }
        })
        .filter(html => html !== undefined);
}

function byHeading(indexEntry) {
    const groupHeadingNode = indexEntry.headingNode;
    const anchor = getLinkUrl(groupHeadingNode) || "";
    let pos = "0";
    if (groupHeadingNode) {
        pos = groupHeadingNode.position.start.line;
    }
    // return key
    return `${indexEntry.file}#${pos}:${anchor}`;
}

/**
 * @param {Context} context
 */
function getIndexFilename(context) {
    const {indexFile} = context.opts.generateFiles;
    if (indexFile && typeof indexFile === "object") {
        return indexFile.file;
    }
}

module.exports = api;
