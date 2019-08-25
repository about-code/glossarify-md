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
const CWD = proc.cwd();

api.link = function(opts) {
    const context = {
        opts: opts,
        terms: [],
        vFiles: [],
        glossaries: {}
    };
    prepare(context)
        .then(context => readTermDefinitions(context))
        .then(context => linkTermOccurrences(context))
        .then(context => writeOutput(context))
        .then(context => writeTestOutput(context))
        .catch(err => console.error(err) && proc.exit(1));
}

/**
 * @private
 * @param {} context
 */
function prepare(context) {
    const {opts} = context;
    const baseDir = opts.baseDir = path.resolve(CWD, opts.baseDir);
    const outDir  = opts.outDir  = path.resolve(baseDir, opts.outDir);

    // Internally use a glossaries context object with keys being the glossary
    // file path. This allows to look up the glossary config by vFile metadata
    // when proccesing a glossary file ( see terminator() ).
    opts.glossaries.forEach(conf => {
        conf.file = conf.file || path.resolve(baseDir, "glossary.md");
        conf.basePath = path.resolve(baseDir, conf.file);
        conf.outPath  = path.resolve(outDir,  conf.file);
        context.glossaries[conf.basePath] = conf;
    });
    return Promise.resolve(context);
}

/**
 * @private
 * @param {Context} context
 * @return {Promise<Term[]>} terms
 */
function readTermDefinitions(context) {
    const {baseDir, outDir, glossaries} = context.opts;
    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: unified()
                    .use(remark_parse)
                    .use(remark_slug)
                    .use(remark_link_headings, {behavior: 'wrap'})
                    .use(terminator(context))
                    .use(noopCompiler)
                    .use(remark_stringify)
                ,cwd: baseDir
                ,files: glossaries.map(g => g.file)
                ,ignoreName: '.mdignore'
                ,ignorePatterns: [outDir]
                ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
                ,alwaysStringify: true
                ,output: false
                ,out: false
                ,color: true
                ,silent: false
            },
            (err, statusCode, uContext) => {
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
 * Glossarifier is the real workhorse which scans the pile
 * of markdown files and inserts at almost every term
 * occurrence a link to the term's definition.
 *
 * @private
 * @param {*} context
 */
function linkTermOccurrences(context) {
    const {baseDir, outDir, filesGlob, glossaries} = context.opts;
    return new Promise((resolve, reject) => {
        unifiedNgin({
            processor: unified()
                .use(remark_parse)
                .use(printAst(PRINT_AST_PRE_LINKIFY))
                .use(getLinkifier(context))
                .use(printAst(PRINT_AST_POST_LINKIFY))
                .use(noopCompiler)
                .use(remark_stringify)
            ,cwd: baseDir
            ,files: [...filesGlob]
            ,ignoreName: '.mdignore'
            ,ignorePatterns: [path.relative(baseDir, outDir), ...glossaries.map(g => path.basename(g.basePath))]
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
 * Terminator climbs along the shallow markdown syntax tree
 * where he picks up all those terms humans use to describe
 * their world. Once he finds a term he immediatly attempts
 * to put it into context.
 *
 * @private
 * @param {*} context
 */
function terminator(context) {
    const { terms, glossaries, opts } = context;
    const { baseDir } = opts;

    return () => (tree, file) => {
        const glossaryKey = path.resolve(baseDir, file.path);
        const glossary = glossaries[glossaryKey];
        if (! glossary) {
            throw new Error("No glossary config found.");
        }

        // It's critically important to obtain a (shallow) copy of child node
        // arrays during tree traversal by means of getChildrenOfNode().
        // Otherwise `Array.shift()` would manipulate the original syntax tree.
        // Array items remain original.
        let nodes = getChildrenOfNode(tree);
        let node = nodes.shift();
        while(node) {
            const children = visitNode(node, terms, glossary);
            if (children) {
                nodes = [...children, ...nodes];
            }
            node = nodes.shift();
        }
        return tree;
    }
}


function State() {};
State.NEW_GLOSSARY = "ng";
State.AWAIT_LINK = "li";
State.AWAIT_LINK_TEXT = "lt";
State.AWAIT_DEFINITION = "df";
State.AWAIT_NEW_TERM=  "nt";
State.active = State.NEW_GLOSSARY;
State.is = (state) => State.active === state;
State.next = (nextState) => State.active = nextState;

function visitNode(node, terms, glossary) {
    if (node.type === "heading") {
        if (node.depth > 1) {
            // New term definition begins with a headline other than the title...
            State.next(State.AWAIT_LINK);
            return getChildrenOfNode(node);
        } else {
            State.next(State.NEW_GLOSSARY);
            return;
        }
    } else if (
        State.is(State.AWAIT_LINK)
        && node.type === "link"
        && node.parent
        && node.parent.type === "heading"
    ) {
        State.next(State.AWAIT_LINK_TEXT)
        return getChildrenOfNode(node);
    } else if (
        State.is(State.AWAIT_LINK_TEXT)
        && node.type === "text"
        && node.parent
        && node.parent.type === "link"
    ) {
        const term = new Term({
            glossary: glossary,
            hint: glossary.termHint,
            anchor: node.parent.url,
            term: node.value,
            regex: new RegExp("\\b" + escapeRegExp(node.value) + "\\b")
        });
        // push the latest term to index 0 to have a
        // fixed position where to look it up when
        // inspecting its subsequent describing paragraph.
        terms.unshift(term);
        State.next(State.AWAIT_DEFINITION)
    } else if (
        State.is(State.AWAIT_DEFINITION)
        && node.type === "text"
    ) {
        // a term's full description might be split accross nodes if it
        // contains markdown syntax elements. So concat with prev. results.
        const term = terms[0];
        const longDesc = (term.longDesc + " " + node.value)
            .replace(/\s\./, ".")
            .replace(/\s{2,}/g, " ")
            .trim();
        const shortDesc = longDesc.match(/(.*\.\s)/);
        term.longDesc = longDesc;
        if(shortDesc)
            term.shortDesc = shortDesc[1].trim();
    } else if (node.children) {
        return getChildrenOfNode(node);
    } else {
        return;
    }
}

/**
 * Returns a *new* array of the given `node`'s children where each child
 + get's a new `parent` property pointing at `node`.
 */
function getChildrenOfNode(node) {
    return node.children.map(child => {
        child.parent = node;
        return child;
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
                        linkNode.url = getTermUrl(context, term, file);
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
 * @param {VFile} file file of term occurrence
 */
function getTermUrl(context, term, file) {
    const {baseUrl, outDir, linking} = context.opts;
    if (linking === 'relative') {
        return path.relative(
            path.resolve(outDir, file.dirname),
            path.resolve(outDir, term.glossary.file)
        ) + term.anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            return `${baseUrl}` + term.anchor;
        } else {
            return path.absolute(
                path.resolve(outDir, term.glossary.file)) + term.anchor;
        }
    } else {
        return term.anchor;
    }
}

function writeOutput(context) {
    const {opts, vFiles} = context;
    const {outDir} = opts;
    return Promise.all(
        vFiles.map((vFile) => new Promise((resolve, reject) => {
            const p = path.resolve(outDir, vFile.path);
            fs.outputFile(p, vFile.toString(), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(context);
                }
            })})
        )
    ).then(() => context);
}

/**
 * Writes some additional files in test mode.
 * @param {} context
 */
function writeTestOutput(context) {
    const {outDir, test} = context.opts;
    if (! test)
        return;

    const termsFile = path.resolve(outDir, "terms.json");
    Object.values(context.glossaries).forEach(gloss => {
        gloss.basePath = `/{redacted}/${path.relative(CWD, gloss.basePath)}`;
        gloss.outPath  = `/{redacted}/${path.relative(CWD, gloss.outPath )}`;
    });
    return new Promise((resolve, reject) => {
        fs.outputFile(termsFile, JSON.stringify(context.terms, null, 2)+ "\n", (err) => {
            err ? reject(err) : resolve(context);
        });
    });
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


/**
 * No-op compiler to satisfy unifiedjs
 * @private
 */
function noopCompiler() {
    this.Compiler = function(tree) {
        return tree;
    };
}

/**
 * Helper function for debugging purposes.
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

module.exports = api;
