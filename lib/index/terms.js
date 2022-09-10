import { heading, html, link, paragraph, root, strong, text } from "mdast-builder";
import { getNodeId, getNodeText } from "../ast/tools.js";
import { TermDefinitionNode } from "../ast/with/term-definition.js";
import { TermOccurrenceNode } from "../ast/with/term-occurrence.js";
import { byGroupHeading, getIndex, group } from "../indexer.js";
import { getFileLinkUrl, relativeFromTo } from "../path/tools.js";
import { collator } from "../text/collator.js";
import { pad } from "../text/tools.js";

/**
 * @typedef { import("./model/context") } Context
 * @typedef { import("./ast/tools").Node } Node
 * @typedef {{
 *      definitions: Term[],
 *      occurrences: {[path: string]: Node}
 * }} IndexOldEntry
 * @typedef {{ [term: string]: IndexOldEntry }} IndexOld
 */

const brk = text("\n");

export const IDX_TERMS = Symbol("termsAsList");
export const IDX_TERMS_BY_ID = Symbol("termsById");
export const IDX_TERMS_BY_PHRASE = Symbol("termsByPhrase_Hash8");
export const IDX_OCCURRENCES_BY_PHRASE = Symbol("termOccurencesByPhrase_Hash8");

export const indexes = [{
    id: IDX_OCCURRENCES_BY_PHRASE
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
    id: IDX_TERMS_BY_ID
    ,title: "Glossary Terms"
    ,filterFn: (node) => node.type === TermDefinitionNode.type
    ,keyFn: (node) => node.headingId
    ,conf: () => null
}
,{
    id: IDX_TERMS_BY_PHRASE
    ,title: "Glossary Terms"
    ,filterFn: (node) => node.type === TermDefinitionNode.type
    ,keyFn: (node) => node.valueHash8 /* use the constant-length hash of the term */
    ,conf: () => null
}
,{
    id: IDX_TERMS
    ,title: "Terms"
    ,filterFn: (node) => node.type === TermDefinitionNode.type
    ,keyFn: () => 0
    ,conf: () => null
}];


/**
 * Returns an Abstract Syntax Tree (AST) for a markdown book index document.
 * A book index document will list glossary terms and for each term it provides
 * links to sections that mention the term. The sections that will be linked
 * and which contribute section titles depend on the heading depth that has been
 * configured for grouping terms.
 *
 * For example, with `indexing.groupByHeadingDepth: 2` titles and links will be
 * those of headings at depth 2. Term occurrences in subsections at depth 3+
 * *can* be indicated with additional *numeric* links formatted as subscript,
 * unless configured otherwise.
 *
 * By default a book index document will contain all terms from all glossaries.
 * However users with multiple glossaries can choose to generate a book index
 * document per glossary.
 *
 * Behavior of this method is configurable and affected by config options
 *
 * - `indexing`
 * - `glossaries`
 * - `generateFiles.indexFile`
 * - `generateFiles.indexFiles`
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
export function getAST(context, indexFileConf) {
    const { title } = indexFileConf = Object.assign(
        {
            title: "Book Index"
            ,hideDeepLinks: false
        }
        ,indexFileConf || {}
    );
    const bookIndexEntries = getSubsetToRender(context, indexFileConf);
    let tree = [
        heading(1, text(title))
        // Concatenate AST for each index entry
        ,...Object
            .keys(bookIndexEntries)
            .sort((term1, term2) => collator.compare(term1, term2))
            .map((term) => getAstForIndexEntry(context, bookIndexEntries[term], indexFileConf))
    ];
    return root(tree);
}

/**
 * Book index document may contain all terms in the book or just terms from a
 * particular glossary. This function determines the subset to render based on
 *
 * - `generateFiles.indexFile.glossary`
 * - `generateFiles.indexFiles[i].glossary`
 * config.
 */
function getSubsetToRender(context, indexFileConf) {
    let bookIndexEntries = {};
    const { glossary } = indexFileConf;
    if (glossary) {
        const baseDir = context.conf.baseDir;
        const allTermEntries = getIndex(IDX_TERMS);
        const termOccEntries = getIndex(IDX_OCCURRENCES_BY_PHRASE);
        const glossaryFile   = relativeFromTo(baseDir, glossary, baseDir);
        const termEntriesInGlossary = []
            .concat(allTermEntries[0])
            .filter(e => e.file === glossaryFile);

        for (let i = 0, len = termEntriesInGlossary.length; i < len; i++) {
            const entry = termEntriesInGlossary[i];
            const term = entry.node.value;
            const termOcc = termOccEntries[term];
            if (termOcc) {
                bookIndexEntries[term] = termOcc;
            }
        }
    } else {
        bookIndexEntries = getIndex(IDX_OCCURRENCES_BY_PHRASE);
    }
    return bookIndexEntries;
}

/**
 * Returns the AST subtree which renders a term heading and links to all
 * occurrences of *a particular* term (= index key).
 *
 * @param {Context} context
 * @param {IndexEntry} entriesForKey
 * @param {Object} indexFileConf
 * @returns {Node} mdast tree
 */
function getAstForIndexEntry(context, entriesForKey, indexFileConf) {
    const key = getNodeText(entriesForKey[0].node);
    return paragraph([
        heading(2, text(key))
        ,brk
        ,brk
        ,...getAstForEntryLinks(context, entriesForKey, indexFileConf)
    ]);
}

/**
 * Returns the AST subtree with the list of links to all occurrences of
 * *a particular* term.
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @param {Object} indexFileConf
 */
function getAstForEntryLinks(context, entriesForKey, indexFileConf) {
    const byHeadings = group(entriesForKey, byGroupHeading);
    const links = [
        ...getAstForGlossaryLinks(context, entriesForKey, indexFileConf)
        ,...getAstForDocumentLinks(context, byHeadings, indexFileConf)
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
function getAstForGlossaryLinks(context, entriesForKey, indexFileConf) {
    const fromIndexFilename = indexFileConf.file;
    return entriesForKey[0].node.termDefs
        .sort(TermDefinitionNode.compare)
        .map((termDefinitionNode) => {
            const toGlossaryFilename = context.resolvePath(termDefinitionNode.glossVFile.glossConf.file);
            const url = getFileLinkUrl(context, fromIndexFilename, toGlossaryFilename, termDefinitionNode.anchor);
            return link(url, termDefinitionNode.getShortDescription(), text(termDefinitionNode.glossVFile.glossConf.title));
        });
}

/**
 * Returns the AST subtree for a single link to a term occurrence.
 *
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getAstForDocumentLinks(context, byHeadings, indexFileConf) {
    return byHeadings
        .map((indexEntryOccurrences) => {
            const indexEntry = indexEntryOccurrences[0]; // [1]
            const toDocumentFilename = indexEntry.file;
            const fromIndexFilename = indexFileConf.file;
            const hideDeepLinks = indexFileConf.hideDeepLinks;
            const termNode = indexEntry.node.termDefs[0];
            const targetHeadingNode = indexEntry.groupHeadingNode;
            const targetHeadingId = getNodeId(targetHeadingNode);
            const targetUrl = getFileLinkUrl(context, fromIndexFilename, toDocumentFilename, targetHeadingId);
            const groupByHeadingDepth = context.conf.indexing.groupByHeadingDepth;
            let linkLabel;
            let linkLabelNode;

            if (targetHeadingNode) {
                linkLabel = getNodeText(targetHeadingNode);
            } else {
                linkLabel = targetUrl;
            }
            if (linkLabel === termNode.glossVFile.glossConf.title) {
                // prevent duplicate listing of glossary titles. They have
                // already made it into the AST before by calling
                // getAstForGlossaryLinks() first.
                return null;
            } else {
                linkLabelNode = text(linkLabel);
            }

            if (targetHeadingNode
                && targetHeadingNode.depth === 1
                && groupByHeadingDepth > 1
            ) {
                // given a Book Index not only contains links to pages but also
                // links to page sections, then among all links highlight those
                // pointing to a page.
                linkLabelNode = strong([linkLabelNode]);
            }

            // Get links to (sub-)sections deeper than 'groupByHeadingDepth'
            const deepOccurrencesAst = getAstForDeepDocumentLinks(
                context, fromIndexFilename, indexEntryOccurrences
            );
            if (hideDeepLinks || deepOccurrencesAst.length === 0) {
                return link(targetUrl, null, linkLabelNode);
            } else {
                return paragraph([
                    link(targetUrl, null, linkLabelNode)
                    ,html("<sub>↳ ")
                    ,...deepOccurrencesAst
                    ,html("</sub>")
                ]);
            }
        })
        .filter(linkNode => linkNode !== null);

    // ___/ Implementation Notes \___
    // [1]: We get the index entries for all occurrences of a particular term
    // below the given heading. Since we can only link to the heading but not
    // each particular term position we can derive the heading link from the
    // first term occurrence, solely.
}

function getAstForDeepDocumentLinks(context, fromIndexFilename, indexEntries) {
    let {groupByHeadingDepth} = context.conf.indexing;
    let i = 1;
    return group(indexEntries, byHeading)
        .map((entriesByHeading) => {
            const { headingNode, file } = entriesByHeading[0];
            if (headingNode && headingNode.depth > groupByHeadingDepth) {
                const sectionId = getNodeId(headingNode);
                const ref = getFileLinkUrl(context, fromIndexFilename, file, sectionId);
                return paragraph([
                    text(`${i > 1 ? ", " : ""}`)
                    ,link(ref, getNodeText(headingNode), text(`${++i}`))
                ]);
            }
        })
        .filter(html => html !== undefined);
}

// A function used as a "groupBy"-criteria.
function byHeading(indexEntry) {
    const groupHeadingNode = indexEntry.headingNode;
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
