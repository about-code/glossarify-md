const Term = require("./term.js");
const regexLinkify = require("./linkify");
const fs = require("fs");
const path = require("path");
const slug = require("remark-slug");
const linkHeadings = require("remark-autolink-headings");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const flatMap = require('unist-util-flatmap');
const uSelectAll = require("unist-util-select").selectAll;
const remark = require("remark");
const remark_parse = require("remark-parse");
const remark_stringify = require("remark-stringify");

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
        .then(context => { if(PRINT_TERMS) console.log(context.terms) });
}

glossarify.unlink = function(opts) {
    readGlossary(opts).then((terms, opts) => removeLinksRecursive(terms, opts));
}

function prepare(context) {
    const {opts} = context;
    const {baseDir, outDir, glossaryFile} = opts;
    return new Promise((resolve) => {
        opts.outDir = path.resolve(baseDir, outDir);
        opts.glossaryPath = path.resolve(baseDir, glossaryFile || "");

        if (! fs.existsSync(opts.outDir)) {
            fs.mkdirSync(opts.outDir);
        }
        resolve(context);
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
                    .use(slug)
                    .use(linkHeadings, {behavior: 'wrap'})
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
                ,output: opts.outDir
                ,color: true
            },
            (err) => { if(err) reject(err); else resolve(context);}
        )
    });
}

function getLinkifier(context) {
    const {terms, opts} = context;
    const modifier = function (tree) {
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

    return function linkifier() {
        return modifier;
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
