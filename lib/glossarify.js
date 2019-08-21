const Term = require("./term.js");
const regexLinkify = require("./linkify");
const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uSelectAll = require("unist-util-select").selectAll;
const remark = require("remark");
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_stringify = require("remark-stringify");
const remark_link_headings = require("remark-autolink-headings");

const glossarify = {};
const PRINT_AST_PRE_LINKIFY = false; // Might be regex. /.*\/table\.md/g;
const PRINT_AST_POST_LINKIFY = false;
const PRINT_TERMS = false;

glossarify.link = function(opts) {
    const context = {
        terms: [],
        opts: opts
    };
    prepare(context)
        .then(context => readGlossaries(context))
        .then(context => glossarify(context))
        .then(context => { if(PRINT_TERMS) console.log(context.terms) })
        .catch((err) => console.log(err) && proc.exit(1));
}

glossarify.unlink = function(opts) {
    readGlossaries(opts).then((terms, opts) => removeLinksRecursive(terms, opts));
}

/**
 * @private
 * @param {} context
 */
function prepare(context) {
    const {opts} = context;
    const {baseDir, outDir} = opts;
    const _outDir = opts.outDir = path.resolve(proc.cwd(), outDir);
    if (_outDir.match(baseDir)) {
        console.error("Invalid configuration: 'outDir' must not be a subdirectory of 'baseDir'.")
        proc.exit(1);
    } else {
        console.log(`Output directory: ${_outDir}`);
    }

    return new Promise((resolve, reject) => {
        // Copy baseDir to outDir first, then make outDir the baseDir to work with.
        // This is a workaround until unified-engine can keep the original directory
        // structure when using its 'output' option with a path (outDir). In its
        // current version 7.0.0 it doesn't recreate the file layout.
        fs.copy(baseDir, _outDir, (err) => {
            if (err) reject(err);
            else resolve(context);
        });
        opts.baseDir = opts.outDir;
        opts.glossaries = opts.glossaries.map(conf => {
            conf.basePath = path.resolve(opts.baseDir, conf.file || "");
            conf.outPath  = path.resolve(opts.outDir,  conf.file || "");
            return conf;
        });
    });
}

/**
 * @private
 * @param {Context} context
 * @return {Promise<Term[]>} terms
 */
function readGlossaries(context) {
    const {opts} = context;
    const {glossaries} = opts;
    const promises = glossaries.map(glossary => {
        return new Promise((resolve, reject) => {
            fs.readFile(glossary.basePath, {encoding: 'utf8'}, (err, markdownText) => {
                if (err) {
                    reject(err);
                } else {
                    unified()
                        .use(remark_parse)
                        .use(remark_slug)
                        .use(remark_link_headings, {behavior: 'wrap'})
                        .use(terminator(context, glossary))
                        .use(noopCompiler)
                        .use(remark_stringify)
                        .process(markdownText)
                        .then(
                            file => resolve(file),
                            err => reject(err)
                        );
                }
            });
        }).then((file) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(glossary.outPath, file.toString(), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`${glossary.outPath} written (with link anchors)`);
                        resolve(context);
                    }
                });
            });
        })
    });
    return Promise.all(promises).then(() => context);
}


/**
 * Terminator uses all its power to craft a unified plug-in
 * which is capable of climbing the shallow markdown syntax
 * tree down to its leafs where it finds those terms humans
 * use to describe their world. The plugin will help him to
 * put those terms in context.
 *
 * @private
 * @param {*} context
 */
function terminator(context, glossary) {
    return () => (tree, file) => {
        const { terms } = context;
        const nodes = tree.children;
        for (const node of nodes) {
            // Headings are the term to look for in Text
            if (node.type === "heading" && node.depth > 1) {
                for (const linkNode of node.children) {
                    if (linkNode.type === "link") {
                        for (const txtNode of linkNode.children) {
                            if (txtNode.type === "text") {
                                const term = new Term({
                                    glossary: glossary,
                                    hint: glossary.termHint,
                                    anchor: linkNode.url,
                                    term: txtNode.value,
                                    regex: new RegExp("\\b" + escapeRegExp(txtNode.value) + "\\b")
                                });
                                // push the latest term to index 0 to have a
                                // fixed position where to look it up when
                                // inspecting its subsequent desc. paragraph.
                                terms.unshift(term);
                            }
                        }
                    }
                }
            } else if (node.type === "paragraph") {
                // mdAST: paragraphs syntactically aren't children of their
                // preceding headings
                for (const txtNode of node.children) {
                    if (txtNode.type === "text" && terms[0]) {
                        const longDesc = txtNode.value;
                        const shortDesc = longDesc.match(/(.*\. )/);
                        terms[0].longDesc = longDesc
                        terms[0].shortDesc = shortDesc ? shortDesc[1].trim() : "";
                    }
                }
            }
        }
        return tree;
    }
}

/**
 * Glossarifier is the real workhorse which scans the pile
 * of markdown files and inserts at almost every term
 * occurence a link to the term's definition.
 *
 * @private
 * @param {*} context
 */
function glossarify(context) {
    const {opts} = context;
    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: remark()
                    .use(printAst(PRINT_AST_PRE_LINKIFY))
                    .use(getLinkifier(context))
                    .use(printAst(PRINT_AST_POST_LINKIFY))
                ,cwd: opts.baseDir
                ,files: [opts.filesGlob]
                ,ignoreName: '.mdignore'
                ,ignorePatterns: [opts.outDir]
                ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
                ,output: true
                ,color: true
            },
            (err) => { if(err) reject(err); else resolve(context);}
        )
    });
}

/**
 * @private
 * @param {*} context
 */
function getLinkifier(context) {
    const {terms} = context;
    return () => (tree, file) => {
        uSelectAll('paragraph, tableCell', tree)
        .filter(node => !(node.type === "tableCell" && node.position.start.line < 3)) // dont linkify table headers
        .forEach(node => {
            terms.forEach(term => {
                regexLinkify(term.regex, (linkNode) => {
                    linkNode.children[0].value += term.hint || "" // ↴
                    linkNode.url = getGlossaryUrl(context, term, file);
                    return linkNode;
                })()(node);
            });
        });
    }
}

/**
 * @private
 * @param {object} context
 * @param {Term} term
 * @param {VFile} file file of term occurence
 */
function getGlossaryUrl(context, term, file) {
    const {baseUrl, baseDir, linking} = context.opts;
    if (linking === 'relative') {
        return path.relative(path.resolve(baseDir, file.dirname), term.glossary.basePath) + term.anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            return `${baseUrl}` + term.anchor;
        } else {
            return path.absolute(term.glossary.path) + term.anchor;
        }
    } else {
        return term.anchor;
    }
}


/**
 * @private
 */
function noopCompiler () {
    this.Compiler = function(tree) {
        return tree;
    };
}

/**
 * @private
 */
function printAst(regExpOrBool) {
    return () => (tree, file) => {
        if (
            (typeof regExpOrBool === "boolean" && regExpOrBool === true) ||
            (
                Object.prototype.toString.call(regExpOrBool) === "[object RegExp]" &&
                path.resolve(file.cwd, file.basename).match(regExpOrBool)
            )
        ) {
            console.log(
`Print AST: ${regExpOrBool}
-----------------------------------
${JSON.stringify(tree, null, 4)}
`)
        }
        return tree;
    }
}

/**
 * We must expect terms to include characters with a special
 * meaning in regexp. Escape user provided terms to avoid
 * breaking the actual regexp search pattern.
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 *
 * @private
 * @param {*} string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = glossarify;
