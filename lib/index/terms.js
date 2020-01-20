const {root, paragraph, text, heading, brk, link } = require("mdast-builder");

const Term = require("../model/term");
const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl: getMarkdownLinkUrl, getNodeText} = require("../ast/tools");
const {getNodeIndex} = require("../indexer");

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
 * @param {Context} context
 * @param {string} fromIndexFile
 * @param {string} toDocumentFile
 * @returns {(node: Node) => void}
 */
function visitor(context, indexEntry, fromIndexFile) {
    const node = indexEntry.node;
    const toDocumentFile = indexEntry.file;
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
    const indexEntries = getNodeIndex("term-occurrence");
    let title = "";
    let indexFilename = "";
    if (indexFile !== null && typeof indexFile === "object") {
        title = indexFile.title;
        indexFilename = indexFile.file;
    } else {
        indexFilename = indexFile;
    }

    for (let i = 0, len = indexEntries.length; i < len; i++) {
        visitor(context, indexEntries[i], indexFilename);
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

module.exports = api;
