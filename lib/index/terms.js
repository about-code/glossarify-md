const { root, paragraph, text, heading, link, html } = require("mdast-builder");

const { TermDefinitionNode } = require("../ast/with/term-definition");
const { TermOccurrenceNode } = require("../ast/with/term-occurrence");
const { getLinkUrl, getNodeText } = require("../ast/tools");
const { getFileLinkUrl } = require("../path/tools");
const { getIndex, group, byGroupHeading } = require("../indexer");
const { collator } = require("../text/collator");

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
const api = {};
const brk = text("  \n");
api.IDX_OCCURRENCES_BY_TEXT = "term_occ";
api.IDX_TERMS_BY_ANCHOR = "term_defs";
api.IDX_TERMS = "terms";
api.IDX_TERMS_BY_GLOSSARY = "terms_by_glossary";

api.indexes = [{
    id: api.IDX_OCCURRENCES_BY_TEXT
    ,title: "Book Index"
    ,filterFn: (node) => node.type === TermOccurrenceNode.type
    ,keyFn:    (node) => node.value
    ,conf:     (context) => {
        const {generateFiles} = context.conf;
        const {indexFile} = generateFiles;
        return indexFile;
    }
}
,{
    id: api.IDX_TERMS_BY_ANCHOR
    ,title: "Glossary Terms"
    ,filterFn: (node) => node.type === TermDefinitionNode.type
    ,keyFn: (node) => node.anchor
    ,conf: () => null
}
,{
    id: api.IDX_TERMS
    ,title: "Terms"
    ,filterFn: (node) => node.type === TermDefinitionNode.type
    ,keyFn: () => 0
    ,conf: () => null
}];


/**
 * Returns the markdown abstract syntax tree that is to be written to the file
 * configured via 'generateFiles.indexFile' config.
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function (context, indexFileConf) {
    let indexEntries;
    if (indexFileConf.glossary) {
        indexEntries = {};
        const matchGlossary = indexFileConf.glossary;
        const termsEntries = getIndex(api.IDX_TERMS);
        const termOccEntries = getIndex(api.IDX_OCCURRENCES_BY_TEXT);
        termsEntries[0]
            .filter(e => !!e.file.match(matchGlossary))
            .forEach(e => {
                const term = e.node.value;
                const termOcc = termOccEntries[term];
                if (termOcc) {
                    indexEntries[e.node.value] = termOcc;
                }
            });
    } else {
        indexEntries = getIndex(api.IDX_OCCURRENCES_BY_TEXT);
    }

    const indexFile = indexFileConf.file;
    let title = "";
    if (indexFileConf !== null && typeof indexFileConf === "object") {
        title = indexFileConf.title;
    }
    if (!title) {
        title = "Book Index";
    }

    // Create AST from index
    let tree = [
        heading(1, text(title))
        // Concatenate AST for each index entry
        ,...Object
            .keys(indexEntries)
            .sort((key1, key2) => collator.compare(key1, key2))
            .map((key) => getIndexEntryAst(context, indexEntries[key], indexFile))
    ];
    return root(tree);
};

/**
 *
 * @param {Context} context
 * @param {IndexEntry} entriesForKey
 * @param {string} indexFilename
 * @returns {Node} mdast tree
 */
function getIndexEntryAst(context, entriesForKey, indexFile) {
    const key = getNodeText(entriesForKey[0].node);
    return paragraph([
        heading(2, text(key))
        ,brk
        ,brk
        ,...getEntryLinksAst(context, entriesForKey, indexFile)
    ]);
}

/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {string} indexFile
 */
function getEntryLinksAst(context, entriesForKey, indexFile) {
    const byHeadings = group(entriesForKey, byGroupHeading);
    const links = [
        ...getGlossaryLinksAst(context, entriesForKey, indexFile)
        ,...getDocumentLinksAst(context, byHeadings, indexFile)
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
 * @param {IndexEntry} entriesForKey
 * @param {string} fromIndexFilename
 * @returns {Node} mdast Node
 */
function getGlossaryLinksAst(context, entriesForKey, fromIndexFilename) {
    return entriesForKey[0].node.termDefs
        .sort(TermDefinitionNode.compare)
        .map((termNode) => {
            const toGlossaryFilename = context.resolvePath(termNode.glossary.file);
            const url = getFileLinkUrl(context, fromIndexFilename, toGlossaryFilename, termNode.anchor);
            return link(url, termNode.getShortDescription(), text(termNode.glossary.title));
        });
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getDocumentLinksAst(context, byHeadings, fromIndexFilename) {
    return byHeadings
        .map((indexEntryOccurrences) => {
            const indexEntry = indexEntryOccurrences[0]; // [1]
            const headingNode = indexEntry.groupHeadingNode;
            const toDocumentFilename = indexEntry.file;
            const anchor = getLinkUrl(headingNode);
            const termNode = indexEntry.node.termDefs[0];
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
    let {groupByHeadingDepth} = context.conf.indexing;
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

module.exports = api;
