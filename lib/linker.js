const Term = require("./term.js");
const linkifyRegex = require("./linkify");
const {printAst, getNodeText, noopCompiler} = require("./ast-tools.js");
const {relativeFromTo, toForwardSlash} = require("./pathplus");
const path = require("path");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uVisit = require("unist-util-visit");
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_stringify = require("remark-stringify");
const remark_link_headings = require("remark-autolink-headings");
const remark_ref_links = require("remark-reference-links");
const url = require("url");
const api = {};

/**
 * Reads the pile of non-glossary markdown files and replaces plaintext term
 * occurrences with linked terms pointing at the term's definition in a
 * glossary.
 *
 * @private
 * @param {*} context
 */
api.linkTermOccurrences = function(context) {
    const {
        baseDir, outDir, includeFiles, keepRawFiles,
        excludeFiles, glossaries, experimentalFootnotes
    } = context.opts;
    return new Promise((resolve, reject) => {
        unifiedNgin({
            processor: unified()
                .use(remark_parse, { footnotes: experimentalFootnotes })
                .use(printAst(context.opts.dev.printInputAst))  // Might be regex. /.*\/table\.md/g;
                .use(remark_slug)
                .use(remark_link_headings, {behavior: 'wrap'})
                .use(linker(context))
                .use(remark_ref_links)
                .use(printAst(context.opts.dev.printOutputAst))
                .use(noopCompiler)
                .use(remark_stringify)
            ,cwd: baseDir
            ,files: [
                ...toForwardSlash(includeFiles)
            ]
            ,ignoreName: '.mdignore'
            ,ignorePatterns: [
                toForwardSlash(path.relative(baseDir, outDir)),
                ,...toForwardSlash(glossaries.map(g => path.basename(g.basePath)))
                ,...toForwardSlash(keepRawFiles)
                ,...toForwardSlash(excludeFiles)
            ]
            ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: false
        }, (err, statusCode, uContext) => {
                if(err) {
                    reject(err);
                } else {
                    context.vFiles = [...context.vFiles, ...uContext.files];
                    resolve(context);
                }
            }
        )
    });
}

/**
 * Linker operates on the abstract syntax tree for a markdown file
 * and searches for occurrences of a glossary term.
 *
 * @private
 * @param {*} context
 */
function linker(context) {
    return () => (tree, file) => {
        const {terms} = context;
        let sectionNode = null;
        uVisit(tree, (node, index, parent) => {
            /*visitor*/
            if (
                node.type === "paragraph"
                || node.type === "tableCell"
            ) {
                terms.byDefinition().forEach(termDefs => {
                    linkify(node, sectionNode, termDefs, context, file);
                });
                return uVisit.SKIP;
                // skip children of paragraphs, since they've already been
                // visited by regexLinkify.
            } else if (node.type === "heading") {
                sectionNode = node;
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
 * Add link nodes to AST.
 *
 * @param {*} termDefs One or more glossary definitions of a particular term
 * @param {*} txtNode text or paragraph node to search for term occurrence
 * @param {*} context context object
 * @param {*} vFile current markdown document file
 * @returns AST node with links
 */
function linkify(txtNode, sectionNode, termDefs, context, vFile) {
    const sectionUrl = getIndexUrlToSection(context, sectionNode, vFile);
    const sectionTitle = getNodeText(sectionNode);
    const term = termDefs[0];
    const hasMultipleDefs = termDefs.length > 1;
    let linkNode_ = null;

    // Primary term link at occurrence. Points at a single glossary but may be
    // followed by additional numbered glossary links if there are multiple
    // term definitions.
    let txtNode_ = linkifyRegex(term.regex, term, (linkNode) => {
        linkNode.title = term.getShortDescription();
        linkNode.url = getGlossaryUrl(context, term, vFile);
        linkNode_ = linkNode;
        if (! hasMultipleDefs) {
            term.addOccurrence(sectionTitle, sectionUrl);
            if (term.hint) {
                if (/\$\{term\}/.test(term.hint)) {
                    linkNode.children[0].value = term.hint.replace("${term}", linkNode.children[0].value);
                } else {
                    linkNode.children[0].value += term.hint;
                }
            }
        }
        return linkNode;
    })()(txtNode);

    // Multiple definitions?
    if (! hasMultipleDefs) {
        return txtNode_;
    }

    // Multiple definitions! Append numbered links for every definition.
    // Insert at linkIndex + 1...
    const childr = txtNode_.children;
    const linkIndex = childr.indexOf(linkNode_);
    if (linkIndex >= 0) {
        txtNode_.children = childr
            .slice(0, linkIndex + 1)
            .concat(termDefs.map((t, i) => {
                t.addOccurrence(sectionTitle, sectionUrl);
                return {
                    type: "link",
                    title: t.getShortDescription(),
                    url: getGlossaryUrl(context, t, vFile),
                    children: [{
                        type: "text",
                        value: i === 0 ? ` (${i})` : `, (${i})`
                    }]
                };
            }))
            .concat(childr.slice(linkIndex + 1));
    }
    return txtNode_;
}


/**
 * Returns the link URL to the glossary file and definition section of a term.
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

/**
 * Returns the URL of the section of a term occurrence.
 *
 * @param {*} context
 * @param {*} vFile
 * @param {*} sectionNode
 */
function getIndexUrlToSection(context, sectionNode, vFile) {
    const {outDir, baseUrl, linking, generateFiles} = context.opts;
    const {indexFile} = generateFiles;
    let sectionAnchor;
    if (sectionNode) {
        sectionAnchor = sectionNode.children[0].url;
    } else {
        sectionAnchor = "";
    }
    let sectionUrl = "";
    let file = `${vFile.dirname}/${vFile.basename}`;
    if (linking === 'relative') {
        sectionUrl = toForwardSlash(
            relativeFromTo(
                path.resolve(outDir, indexFile || "."),
                path.resolve(outDir, file)
            )
        ) + sectionAnchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            sectionUrl = toForwardSlash(path.resolve(outDir, file))
                .replace(outDir, baseUrl)
                .replace(/^(.*)(\/|\\)$/, "$1")
                + sectionAnchor;
        } else {
            sectionUrl = toForwardSlash(path.resolve(outDir, file))
                + sectionAnchor;
        }
    } else {
        sectionUrl = sectionAnchor;
    }
    return url.parse(sectionUrl).format();
}

module.exports = api;
