const Term = require("./term.js");
const regexLinkify = require("./linkify");
const common = require("./common.js");
const path = require("path");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uVisit = require("unist-util-visit");
const remark_parse = require("remark-parse");
const remark_stringify = require("remark-stringify");
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
    const {baseDir, outDir, includeFiles, excludeFiles, glossaries} = context.opts;
    return new Promise((resolve, reject) => {
        unifiedNgin({
            processor: unified()
                .use(remark_parse)
                .use(common.printAst(context.opts.dev.printInputAst))  // Might be regex. /.*\/table\.md/g;
                .use(linker(context))
                .use(remark_ref_links)
                .use(common.printAst(context.opts.dev.printOutputAst))
                .use(common.noopCompiler)
                .use(remark_stringify)
            ,cwd: baseDir
            ,files: [...includeFiles]
            ,ignoreName: '.mdignore'
            ,ignorePatterns: [
                path.relative(baseDir, outDir),
                ...glossaries.map(g => path.basename(g.basePath)),
                ...excludeFiles
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
        uVisit(tree, (node, index, parent) => {
            /*visitor*/
            if ( node.type === "blockquote"
                || node.type === "heading"
                || node.type === "html"
            ) {
                return uVisit.SKIP;
            }
            else if (
                node.type === "paragraph"
                || node.type === "tableCell"
            ) {
                terms.byOccurrence().forEach(term => {
                    regexLinkify(term.regex, (linkNode) => {
                        linkNode.children[0].value += (term.hint || "");
                        linkNode.url = getTermUrl(context, term, file);
                        return linkNode;
                    })()(node);
                });
                return uVisit.SKIP;
                // skip children of paragraph, since they've already been
                // visited by regexLinkify.
            }
            else {
                return uVisit.CONTINUE;
            }
        });
        return tree;
    }
}



/**
 * @private
 * @param {object} context
 * @param {Term} term
 * @param {VFile} file file of term occurrence
 */
function getTermUrl(context, term, file) {
    const {baseUrl, outDir, linking} = context.opts;
    let result = "";
    if (linking === 'relative') {
        result = path.relative(
            path.resolve(outDir, file.dirname),
            path.resolve(outDir, term.glossary.file)
        ) + term.anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            result = `${baseUrl}` + term.anchor;
        } else {
            result = path.absolute(
                path.resolve(outDir, term.glossary.file)) + term.anchor;
        }
    } else {
        result = term.anchor;
    }
    return url.parse(result.replace(path.sep, "/")).format();
}

module.exports = api;
