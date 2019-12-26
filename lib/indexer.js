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
 * }} IndexEntry
 * Index built when using unified indexer() plug-in.
 * {
 *   "term": {
 *      definitions: [Term, Term],
 *      occurrences: {
 *        "./document1#foo": { headingNode: Node }
 *        "./document2#bar": { headingNode: Node }
 *      }
 *   }
 * }
 * @typedef {{ [term: string]: IndexEntry }} Index
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
    if (! indexFilename)
        return (tree) => tree;
    else
        return (tree, vFile) => {
            const currentDocFilename = `${vFile.dirname}/${vFile.basename}`;
            uVisit(tree, "term-occurrence", getNodeVisitor(context, indexFilename, currentDocFilename));
            return tree;
        };

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
        if (headingNode)
            headingAnchor = getMarkdownLinkUrl(headingNode);
        else
            headingAnchor = "";


        // Get URL from index file to the section (heading) in which the term was found
        const docRef = getFileLinkUrl(context, fromIndexFile, toDocumentFile, headingAnchor);
        const term = termDefs[0].term;
        if (! index[term])
            index[term] = {
                definitions: termDefs
                ,occurrences: {}
            };

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
    if (indexFile && typeof indexFile === "object")
        return indexFile.file;
    else
        return indexFile;

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
        heading(4, text(txtTerm))
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
        if (i > 0)
            linksSeparated.push(text(" - ")); // link separator

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
            if (headingNode)
                linkText = getNodeText(headingNode);
            else
                linkText = ref;

            return link(ref, null, text(linkText));
        });

    // Implementation Notes:
    // [1]: sort to gain reproducable results accross OS platforms
}

module.exports = api;
