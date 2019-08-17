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
const PRINT_AST = false;
const PRINT_TERMS = false;

glossarify.link = function(opts) {
    const context = {
        terms: [],
        opts: opts
    };
    prepare(context)
        .then(context => readGlossary(context))
        .then(context => writeGlossary(context))
        .then(context => glossarifyFiles(context))
        .then(context => { if(PRINT_TERMS) console.log(context.terms) })
        .catch((err) => console.log(err) && proc.exit(1));
}

glossarify.unlink = function(opts) {
    readGlossary(opts).then((terms, opts) => removeLinksRecursive(terms, opts));
}

function prepare(context) {
    const {opts} = context;
    const {baseDir, outDir, glossaryFile} = opts;
    return new Promise((resolve, reject) => {
        const _outDir = opts.outDir = path.resolve(baseDir, outDir);
        if (_outDir.match(opts.baseDir)) {
            console.error("Invalid configuration: 'outDir' must not be a target in 'baseDir'.")
            proc.exit(1);
        }
        // Copy baseDir to outDir first, then make outDir the baseDir to work with.
        // This is a workaround until unified-engine can keep the original directory
        // structure when using its 'output' option with a path (outDir). In its
        // current version 7.0.0 it doesn't recreate the file layout.
        fs.copy(opts.baseDir, _outDir, (err) => {
            if (err) reject(err);
            else resolve(context);
        });
        opts.baseDir = opts.outDir;
        opts.glossaryPath = path.resolve(opts.baseDir, glossaryFile || "");
    });
}

/**
 * @param {Context} context
 * @return {Promise<Term[]>} terms
 */
function readGlossary(context) {
    const {opts} = context;
    const {glossaryPath} = opts;
    return new Promise((resolve, reject) => {
        fs.readFile(glossaryPath, {encoding: 'utf8'}, (err, markdownText) => {
            if (err) {
                reject(err);
            } else {
                unified()
                    .use(remark_parse)
                    .use(remark_slug)
                    .use(remark_link_headings, {behavior: 'wrap'})
                    .use(getTermFactory(context))
                    .use(noopCompiler)
                    .use(remark_stringify)
                    .process(markdownText)
                    .then((file) => {
                        context.result = file.toString();
                        resolve(context)
                    },(err) => {
                        reject(err);
                    });
            }
        });
    });

}

function writeGlossary(context) {
    return new Promise((resolve, reject) => {
        const {opts} = context;
        const {outDir, glossaryFile} = opts;
        fs.writeFile(path.resolve(outDir, glossaryFile), context.result, {encoding: 'utf-8'}, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Glossary updated.")
                context.result = null;
                resolve(context);
            }
        });
    });
}

function getTermFactory(context) {
    return function termFactory() {
        return function (tree, file) {
            const nodes = tree.children;
            const { terms, opts } = context;
            const { baseUrl } = opts;
            for (const topNode of nodes) {
                if (topNode.type === "heading" && topNode.depth > 1) {
                    for (const linkNode of topNode.children) {
                        if (linkNode.type === "link") {
                            const term = new Term({
                                anchor: linkNode.url,
                                url: `${baseUrl}` + linkNode.url,
                            });
                            for (const txtNode of linkNode.children) {
                                if (txtNode.type === "text") {
                                    term.term = txtNode.value;
                                    term.regex = new RegExp("\\b" + escapeRegExp(term.term) + "\\b");
                                }
                            }
                            terms.unshift(term);
                        }
                    }
                } else if (topNode.type === "paragraph") {
                    for (const txtNode of topNode.children) {
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
}

function noopCompiler () {
    this.Compiler = function(tree) {
        return tree;
    };
}

function printAst() {
    return function (tree) {
        if (PRINT_AST) {
            console.log(JSON.stringify(tree, null, 4));
        }
        return tree;
    }
}

function glossarifyFiles(context) {
    const {opts} = context;
    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: remark()
                    .use(getLinkifier(context))
                    .use(printAst)
                ,cwd: opts.baseDir
                ,files: ["."]
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

function getLinkifier(context) {
    const {terms, opts} = context;
    return () => (tree) => {
        const nodes = uSelectAll('paragraph text', tree);
        for (const node of nodes) {
            const txt = node.value;
            for (term of terms) {
                t = term.term;
                regexLinkify(term.regex, (linkNode) => {
                    linkNode.children[0].value += " ↴" // ↴
                    linkNode.url = term.url;
                    return linkNode;
                })()(tree);
            }
        }
    }
}

/**
 * We must expect terms to include characters with a special
 * meaning in regexp. Escape user provided terms to avoid
 * breaking the actual regexp search pattern.
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 *
 * @param {*} string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = glossarify;
