const uVisit = require('unist-util-visit');
const {root, paragraph, text, heading, brk, link } = require('mdast-builder');
const url = require('url');
const path = require('path');

const {relativeFromTo, toForwardSlash} = require('./pathplus');
const {getLinkUrl: getMarkdownLinkUrl, getNodeText} = require('./ast-tools.js');

/**
 * Index built when using unified indexer() plug-in.
 *
 * {
 *   "term": {
 *      definitions: [Term, Term],
 *      occurrences: {
 *        "./document1#foo": { headingNode: Node }
 *        "./document2#bar": { headingNode: Node }
 *      }
 *   }
 * }
 */
const index = {}


/**
 * Unified plug-in to scan for links to glossary terms and remember their
 * section of use for index file generation.
 */
function indexer(context) {
    const indexFilename = getIndexFilename(context);
    if (! indexFilename) {
        return () => (tree, vFile) => {};
    } else {
        return () => (tree, vFile) => {
            const currentDocFilename = `${vFile.dirname}/${vFile.basename}`;
            uVisit(tree, 'term-occurrence', getNodeVisitor(context, indexFilename, currentDocFilename));
        };
    }
}

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
        const docRef = getFileLinkUrl(context, fromIndexFile, toDocumentFile, headingAnchor)
        const term = termDefs[0].term;
        if (! index[term]) {
            index[term] = {
                definitions: termDefs,
                occurrences: {}
            }
        }
        index[term].occurrences[docRef] = { headingNode };
    };
}

/**
 * Returns the filename relative to 'outDir' as given by glossarify-md config
 *
 * @param {} context
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
 * @param {*} context
 */
function getAST(context) {
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
        heading(1, text(title || 'Book Index')),
        // Concatenate AST for each index entry
        ...Object
            .keys(index)
            .sort()
            .map(key => getIndexEntryAst(context, index[key], indexFilename))
    ];
    return root(tree);
}

function getIndexEntryAst(context, indexEntry, indexFilename) {
    return heading(4, [
        text(indexEntry.definitions[0].term),
        brk,
        paragraph(
            getEntryLinksAst(context, indexEntry, indexFilename)
        )
    ]);
}

function getEntryLinksAst(context, indexEntry, indexFilename) {
    const links = [
        ...getGlossaryLinksAst(context, indexEntry, indexFilename),
        ...getDocumentLinksAst(context, indexEntry)
    ];
    const linksSeparated = [];
    for (let i = 0, len = links.length; i < len; i++) {
        if (i > 0) {
            linksSeparated.push(text(' - ')); // link separator
        }
        linksSeparated.push(links[i]);
    }
    return linksSeparated;
}

function getGlossaryLinksAst(context, indexEntry, fromIndexFilename) {
    return indexEntry.definitions.map((term, i) => {
        const toGlossaryFilename =  term.glossary.outPath;
        const url = getFileLinkUrl(context, fromIndexFilename, toGlossaryFilename, term.anchor);
        return link(url, term.getShortDescription(), text(term.glossary.title));
    });
}

function getDocumentLinksAst(context, indexEntry) {
    return Object.keys(indexEntry.occurrences).map((ref) => {
        const {headingNode} = indexEntry.occurrences[ref];
        let linkText;
        if (headingNode) {
            linkText = getNodeText(headingNode);
        } else {
            linkText = ref;
        }
        return link(ref, null, text(linkText));
    });
}

/**
 * Returns the URL for the section heading preceding a term occurrence.
 *
 * @param {*} context
 * @param {string} filenameFrom path
 * @param {string} filenameTo path
 * @param {string} anchor optional anchor or url fragment for references to sections
 */
function getFileLinkUrl(context, filenameFrom, filenameTo, anchor) {
    const {outDir, baseUrl, linking, generateFiles} = context.opts;
    let targetUrl = "";
    if (linking === 'relative') {
        targetUrl = toForwardSlash(
            relativeFromTo(
                path.resolve(outDir, filenameFrom || "."),
                path.resolve(outDir, filenameTo)
            )
        ) + anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            targetUrl = toForwardSlash(path.resolve(outDir, filenameFrom))
                .replace(outDir, baseUrl)
                .replace(/^(.*)(\/|\\)$/, "$1")
                + anchor;
        } else {
            targetUrl = toForwardSlash(path.resolve(outDir, filenameFrom))
                + anchor;
        }
    } else {
        targetUrl = anchor;
    }
    return url.parse(targetUrl).format();
}

module.exports = { indexer, getAST };
