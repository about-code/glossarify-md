const Term = require("./term.js");
const regexLinkify = require("./linkify");
const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uSelectAll = require("unist-util-select").selectAll;
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_stringify = require("remark-stringify");
const remark_link_headings = require("remark-autolink-headings");

const api = {};
const PRINT_AST_PRE_LINKIFY = false; // Might be regex. /.*\/table\.md/g;
const PRINT_AST_POST_LINKIFY = false;
const PRINT_TERMS = false;

api.link = function(opts) {
    const context = {
        opts: opts,
        terms: [],
        vFiles: [],
        glossaries: {}
    };
    prepare(context)
        .then(context => readTermDefinitions(context))
        .then(context => linkTermOccurences(context))
        .then(context => writeOutput(context))
        .then(context => { if(PRINT_TERMS) console.log(context.terms) })
        .catch((err) => console.log(err) && proc.exit(1));
}

/**
 * @private
 * @param {} context
 */
function prepare(context) {
    const {opts} = context;
    const {baseDir} = opts;
    const outDir = opts.outDir = path.resolve(proc.cwd(), opts.outDir);
    console.log(`Output directory: ${outDir}`);

    opts.glossaries.forEach(conf => {
        conf.basePath = path.resolve(baseDir, conf.file || "");
        conf.outPath  = path.resolve(outDir,  conf.file || "");
        context.glossaries[conf.file] = conf;
    });
    return new Promise(resolve => resolve(context));
}

/**
 * @private
 * @param {Context} context
 * @return {Promise<Term[]>} terms
 */
function readTermDefinitions(context) {
    const {opts} = context;
    return new Promise((resolve, reject) => {
        unifiedNgin({
            processor: unified()
                .use(remark_parse)
                .use(remark_slug)
                .use(remark_link_headings, {behavior: 'wrap'})
                .use(terminator(context))
                .use(noopCompiler)
                .use(remark_stringify)
            ,cwd: opts.baseDir
            ,files: opts.glossaries.map(g => g.file)
            ,ignoreName: '.mdignore'
            ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: true
        },(err, code, uContext) => {
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
 * Glossarifier is the real workhorse which scans the pile
 * of markdown files and inserts at almost every term
 * occurence a link to the term's definition.
 *
 * @private
 * @param {*} context
 */
function linkTermOccurences(context) {
    const {opts} = context;
    return new Promise((resolve, reject) => {
        unifiedNgin({
            processor: unified()
                .use(remark_parse)
                .use(printAst(PRINT_AST_PRE_LINKIFY))
                .use(getLinkifier(context))
                .use(printAst(PRINT_AST_POST_LINKIFY))
                .use(noopCompiler)
                .use(remark_stringify)
            ,cwd: opts.baseDir
            ,files: [opts.filesGlob]
            ,ignoreName: '.mdignore'
            ,ignorePatterns: [opts.outDir, ...opts.glossaries.map(g => path.basename(g.file))]
            ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: true
        },(err, code, uContext) => {
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
 * Terminator uses all its power to craft a unified plug-in
 * which is capable of climbing the shallow markdown syntax
 * tree down to its leafs where it finds those terms humans
 * use to describe their world. The plugin will help him to
 * put those terms in context.
 *
 * @private
 * @param {*} context
 */
function terminator(context) {
    const {terms, glossaries} = context;
    return () => (tree, file) => {
        const glossary = glossaries[file.dirname + "/" + file.path];
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
 * @private
 * @param {*} context
 */
function getLinkifier(context) {
    const {terms} = context;
    return () => (tree, vFile) => {
        uSelectAll('paragraph, tableCell', tree)
            .filter(node => !(node.type === "tableCell" && node.position.start.line < 3)) // dont linkify table headers
            .forEach(node => {
                terms.forEach(term => {
                    regexLinkify(term.regex, (linkNode) => {
                        linkNode.children[0].value += term.hint || "" // ↴
                        linkNode.url = getGlossaryUrl(context, term, vFile);
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
 * @param {VFile} vFile file of term occurence
 */
function getGlossaryUrl(context, term, vFile) {
    const {baseUrl, outDir, linking} = context.opts;
    if (linking === 'relative') {
        return path.relative(path.resolve(outDir, vFile.dirname), term.glossary.file) + term.anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            return `${baseUrl}` + term.anchor;
        } else {
            return path.absolute(outDir, term.glossary.file) + term.anchor;
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

function writeOutput(context) {
    const {opts, vFiles} = context;
    const {outDir} = opts;
    const promises = vFiles.map((file) => {
        const p = path.resolve(outDir, file.path)
        return new Promise((resolve, reject) => {
            fs.outputFile(p, file.toString(), (err) => {
                if (err) {
                    return reject(err);
                } else {
                    console.log("File written:", p);
                    resolve();
                }
            });
        });
    });
    return Promise.all(promises);
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

module.exports = api;
