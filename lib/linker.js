const path = require("path");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uVisit = require("unist-util-visit");
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_stringify = require("remark-stringify");
const remark_link_headings = require("remark-autolink-headings");
const remark_ref_links = require("remark-reference-links");
const {link, text} = require("mdast-builder");
const url = require("url");

const Context = require("./context");
const Term = require("./term");
const linkifyRegex = require("./linkify");
const {indexer} = require("./indexer");
const {counter} = require("./counter");
const {printAst, noopCompiler} = require("./ast-tools");
const {toForwardSlash} = require("./pathplus");

const html = (value) => {
    return {
        type: "html",
        value: value
    };
}

const api = {};

// Tell remark_stringify to not produce any output for a term occurrence
remark_stringify
    .Compiler
    .prototype
    .visitors["term-occurrence"] = function(node) {};

/**
 * Reads the pile of markdown files and replaces plaintext term occurrences with
 * links pointing to the term definition in one or more glossaries.
 *
 * @private
 * @param {Context} context
 * @return {Promise<Context>} context
 */
api.linkTermOccurrences = function(context) {
    const {
        baseDir, outDir, includeFiles, keepRawFiles,
        excludeFiles, experimentalFootnotes, dev
    } = context.opts;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = {
            processor: unified()
                .use(remark_parse, { footnotes: experimentalFootnotes })
                .use(printAst, { match: dev.printInputAst })  // Might be regex. /.*\/table\.md/g;
                .use(remark_slug)
                .use(linker, { context: context })
                .use(remark_ref_links)
                .use(remark_link_headings, {behavior: 'wrap'})
                .use(indexer, { context: context })
                .use(counter, { context: context })
                .use(printAst, { match: dev.printOutputAst })
                .use(noopCompiler)
                .use(remark_stringify)
            ,cwd: baseDir
            ,files: [
                ...toForwardSlash(includeFiles)
            ]
            ,ignoreName: '.mdignore'
            ,ignorePatterns: [
                toForwardSlash(path.relative(baseDir, outDir)),
                ,...toForwardSlash(keepRawFiles)
                ,...toForwardSlash(excludeFiles)
            ]
            ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: false
        };
        unifiedNgin(unifiedNginConf, (err, statusCode, uContext) => {
            if(err) {
                reject(err);
            } else {
                context.vFiles = [...context.vFiles, ...uContext.files];
                resolve(context);
            }
        });
    });
}

/**
 * Linker operates on the abstract syntax tree for a markdown file
 * and searches for occurrences of a glossary term.
 *
 * @private
 * @param {*} context
 */
function linker(opts) {
    const {context} = opts
    return (tree, file) => {
        const {terms} = context;
        let headingNode = null;
        uVisit(tree, (node, index, parent) => {
            /*visitor*/
            if (
                node.type === "paragraph"
                || node.type === "tableCell"
            ) {
                terms.byDefinition().forEach(termDefs => {
                    linkify(node, headingNode, termDefs, context, file);
                });
                return uVisit.SKIP;
                // skip children of paragraphs, since they've already been
                // visited by regexLinkify.
            } else if (node.type === "heading") {
                headingNode = node;
                return uVisit.SKIP;
            } else if (
                node.type === "blockquote"
                || node.type === "html"
            ) {
                return uVisit.SKIP;
            } else {
                return uVisit.CONTINUE;
            }
        });
        return tree;
    }
}

/**
 * Scans the given paragraph node for occurrences of a term, splits its text
 * node children at term positions and inserts link nodes for each term.
 *
 * @param {Node} newParagraphNode text or paragraph node to search for term occurrence
 * @param {Node} headingNode the heading node preceding a paragraph node
 * @param {Term[]} termDefs One or more glossary definitions of a particular term
 * @param {Context} context context object
 * @param {VFile} vFile current markdown document file
 * @returns AST node with links
 */
function linkify(paragraphNode, headingNode, termDefs, context, vFile) {
    const hasMultipleDefs = termDefs.length > 1;
    const term = termDefs[0];
    const newLinkNodes = [];

    // Search and insert link nodes
    const newParagraphNode = linkifyRegex(paragraphNode, term.regex, (linkNode) => {
        linkNode.title = term.getShortDescription();
        linkNode.url = getGlossaryUrl(context, term, vFile);
        linkNode.children.push({
            type: "term-occurrence",
            termDefs: termDefs,
            headingNode: headingNode
        });
        if (! hasMultipleDefs) {
            if (term.hint) {
                if (/\$\{term\}/.test(term.hint)) {
                    linkNode.children[0].value = term.hint.replace("${term}", linkNode.children[0].value);
                } else {
                    linkNode.children[0].value += term.hint;
                }
            }
        }
        newLinkNodes.push(linkNode);
        return linkNode;
    });

    // Has term multiple definitions?
    if (! hasMultipleDefs) {
        return newParagraphNode;
    }

    // Term has multiple definitions {0, 1, 2}. Insert additional (numbered) link nodes
    // after the term link node with links to each glossary definition.
    for (let i = 0, len = newLinkNodes.length; i < len; i++) {
        const lNode = newLinkNodes[i];
        const pChildren = newParagraphNode.children;
        const lNodePos = pChildren.indexOf(lNode);
        if (lNodePos >= 0) {
            newParagraphNode.children = pChildren
                .slice(0, lNodePos + 1)                                // split
                .concat(termDefs                                       // insert
                    .map((t, j) => {
                        const glossUrl = getGlossaryUrl(context, t, vFile);
                        const shortDesc = t.getShortDescription();
                        return link(glossUrl, shortDesc,
                            html(j === 0 ? `<sup>${j+1})</sup>` : `<sup> ${j+1})</sup>`)
                        );
                    })
                )
                .concat(pChildren.slice(lNodePos + 1));
        }
    }
    return newParagraphNode;
}


/**
 * Returns the link URL to the glossary file and definition heading of a term.
 * In case of "relative" linking config, returns the link URL relative to the
 * file where the term occurred.
 *
 * @private
 * @param {object} context
 * @param {Term} term
 * @param {VFile} vFile file of term occurrence
 */
function getGlossaryUrl(context, term, vFile) {
    const {baseUrl, outDir, linking} = context.opts;
    const glossary = term.glossary;
    let termUrl = "";
    if (linking === 'relative') {
        termUrl = toForwardSlash(
            path.relative(
                path.resolve(outDir, vFile.dirname),
                path.resolve(outDir, glossary.file)
            )
        ) + term.anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            termUrl = toForwardSlash(
                glossary.outPath
                    .replace(outDir, baseUrl)
                    .replace(/^(.*)(\/|\\)$/, "$1")
                    + term.anchor
            );
        } else {
            termUrl = toForwardSlash(
                path.resolve(outDir, glossary.file)
            ) + term.anchor;
        }
    } else {
        termUrl = term.anchor;
    }
    return url.parse(termUrl).format();
}

module.exports = api;
