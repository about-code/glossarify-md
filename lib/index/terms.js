const {root, paragraph, text, heading, brk, link } = require("mdast-builder");

const Term = require("../model/term");
const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl, getNodeText} = require("../ast/tools");
const {getIndex, groupByHeading} = require("../indexer");

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
api.indices = [{
    id: "index/terms/byTerm"
    ,filterFn: (indexEntry) => indexEntry.node.type === "term-occurrence"
    ,keyFn:    (indexEntry) => indexEntry.node.termDefs[0].term
}];

/**
 * Returns the markdown abstract syntax tree that is to be written to the file
 * configured via 'generateFiles.indexFile' config.
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function(context) {
    const {indexFile} = context.opts.generateFiles;
    const indexEntries = getIndex("index/terms/byTerm");
    let title = "";
    if (indexFile !== null && typeof indexFile === "object") {
        title = indexFile.title;
    }

    // Create AST from index
    let tree = [
        heading(1, text(title || "Book Index"))
        // Concatenate AST for each index entry
        ,...Object
            .keys(indexEntries)
            .sort((key1, key2) => key1.localeCompare(key2, "en"))
            .map((key) => getIndexEntryAst(context, indexEntries[key]))
    ];
    return root(tree);
};

/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntriesForTerm
 * @param {string} indexFilename
 * @returns {Node} mdast tree
 */
function getIndexEntryAst(context, indexEntriesForTerm) {
    const txtTerm = indexEntriesForTerm[0].node.termDefs[0].term;
    return paragraph([
        heading(2, text(txtTerm))
        ,brk
        ,brk
        ,...getEntryLinksAst(context, indexEntriesForTerm)
    ]);
}

/**
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {string} indexFilename
 */
function getEntryLinksAst(context, indexEntriesForTerm) {
    const indexFilename = getIndexFilename(context);
    const byHeadings = groupByHeading(indexEntriesForTerm);
    const links = [
        ...getGlossaryLinksAst(context, indexEntriesForTerm, indexFilename)
        ,...getDocumentLinksAst(context, byHeadings, indexFilename)
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
 * @param {IndexEntry} indexEntries
 * @param {string} fromIndexFilename
 * @returns {Node} mdast Node
 */
function getGlossaryLinksAst(context, indexEntries, fromIndexFilename) {
    return indexEntries[0].node.termDefs
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
function getDocumentLinksAst(context, byHeadings, fromIndexFilename) {
    return byHeadings
        .map((indexEntryOccurrences) => {
            const indexEntry = indexEntryOccurrences[0]; // [1]
            const headingNode = indexEntry.groupHeadingNode;
            const toDocumentFilename = indexEntry.file;
            const anchor = getLinkUrl(headingNode);
            const term = indexEntry.node.termDefs[0];
            const ref = getFileLinkUrl(context, fromIndexFilename, toDocumentFilename, anchor);
            let linkText;
            if (headingNode) {
                linkText = getNodeText(headingNode);
            } else {
                linkText = ref;
            }
            if (linkText === term.glossary.title) {
                // prevent duplicate listing of glossary title (see also getGlossaryLinksAst())
                return null;
            } else {
                return link(ref, null, text(linkText));
            }
        })
        .filter(linkNode => linkNode !== null);

    // Implementation Notes:
    // [1]: We get the index entries for all occurrences of a particular term
    // below the given heading. Since we can only link to the heading but not
    // each particular term position we can derive the heading link from the
    // first term occurrence, solely.
}

/**
 * @deprecated See https://github.com/about-code/glossarify-md/blob/master/CHANGELOG.md#deprecation-notices
 * @param {Context} context
 */
function getIndexFilename(context) {
    const {indexFile} = context.opts.generateFiles;
    if (typeof indexFile !== "string") {
        return indexFile.file;
    } else {
        return indexFile;
    }
}

module.exports = api;
