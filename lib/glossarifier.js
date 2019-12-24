const path = require("path");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uVisit = require("unist-util-visit");
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_link_headings = require("remark-autolink-headings");

const Context = require("./context");
const Glossary = require("./glossary");
const Term = require("./term");
const {printAst, noopCompiler, getNodeText} = require("./ast-tools");
const {toForwardSlash} = require("./pathplus");

const api = {};

/**
 * Reads glossary markdown files into a dictionary.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
api.readGlossaries = function(context) {
    prepare(context);
    const {
        baseDir, outDir, glossaries, keepRawFiles, excludeFiles,
        experimentalFootnotes, dev
    } = context.opts;
    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: unified()
                    .use(remark_parse, { footnotes: experimentalFootnotes })
                    .use(printAst, { match: dev.printInputAst })  // Might be regex. /.*\/table\.md/g;
                    .use(remark_slug)
                    .use(remark_link_headings, {behavior: 'wrap'})
                    .use(terminator, { context: context })
                    .use(printAst, { match: dev.printOutputAst }) // Might be regex. /.*\/table\.md/g;
                    .use(noopCompiler)
                ,cwd: baseDir
                ,files: toForwardSlash(glossaries.map(g => g.file).sort((f1,f2) => f1.localeCompare(f2, 'en')))
                ,ignoreName: '.mdignore'
                ,ignorePatterns: [
                    toForwardSlash(path.relative(baseDir, outDir))
                    ,...toForwardSlash(keepRawFiles)
                    ,...toForwardSlash(excludeFiles)
                ]
                ,extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown']
                ,alwaysStringify: true
                ,output: false
                ,out: false
                ,color: true
                ,silent: false
            },
            (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(context);
                }
            }
        )
    });
}

function prepare(context) {
    const {glossaries, baseDir, outDir} = context.opts;

    // Instantiate `context.opts.glossaries` into an array of type `Glossary[]`.
    // Thereby set up a `context.glossaries` map with keys being a glossary
    // file path and value being a `Glossary` instance in order to access
    // a `Glossary` instance by path. The latter allows to look up the glossary
    // config by vFile metadata when proccesing glossary files with unifiedjs.
    context.opts.glossaries = glossaries.map(conf => {
        const g = new Glossary(conf);
        g.file = conf.file || path.join(baseDir, "glossary.md");
        g.basePath = toForwardSlash(path.resolve(baseDir, conf.file));
        g.outPath  = toForwardSlash(path.resolve(outDir,  conf.file));
        context.glossaries[g.basePath] = g;
        return g;
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
function terminator(opts) {
    const { context } = opts;
    const { glossaries } = context;
    const { baseDir } = context.opts;
    return (tree, file) => {
        const glossaryKey = toForwardSlash(path.resolve(baseDir, file.path));
        const glossary = glossaries[glossaryKey];
        if (! glossary) {
            throw new Error("No glossary config found.");
        }
        glossary.vFile = file;
        uVisit(tree, getTermVisitor(context, glossary));
        return tree;
    }
}


const State = function() {};
State.NEW_GLOSSARY = 1;
State.AWAIT_LINK = 2;
State.AWAIT_LINK_TEXT = 4;
State.AWAIT_DEFINITION = 8;
State.AWAIT_ALIAS = 16;
State.AWAIT_NEW_TERM =  32;
State.active = State.NEW_GLOSSARY;
State.is = (state) => State.active & state;
State.next = (nextState) => State.active = nextState;


/**
 * @private
 * @param {@} terms
 * @param {*} glossary
 */
function getTermVisitor(context, glossary) {
    return function visitor(node, idx, parent) {
        const {terms, opts} = context;
        if (node.type === "heading") {
            if (node.depth === 1) {
                glossary.title = getNodeText(node);
                State.next(State.NEW_GLOSSARY);
            } else if (node.depth > 1) {
                // New term definition begins with a headline other than the title...
                State.next(State.AWAIT_LINK);
            } else {
                State.next(State.NEW_GLOSSARY);
            }
        }
        else if (
            State.is(State.AWAIT_LINK)
            && node.type === "link"
            && parent.type === "heading"
        ) {
            State.next(State.AWAIT_LINK_TEXT)
        }
        else if (
            State.is(State.AWAIT_LINK_TEXT)
            && node.type === "text"
            && parent.type === "link"
        ) {
            const anchor = parent.url;
            const term = new Term({
                glossary: glossary,
                hint: glossary.termHint,
                anchor: anchor,
                term: node.value,
                ignoreCase: opts.ignoreCase
            });
            terms.add(term);
            State.next(State.AWAIT_DEFINITION | State.AWAIT_ALIAS);
        }
        else if (
            State.is(State.AWAIT_ALIAS)
            && node.type === "html"
        ) {
            if (/\<\!--\n?\s?Aliases:/g.test(node.value)) {
                terms.getLatest().setAliases(
                    node.value
                        .replace(/\<\!--\s?\S?Aliases:\s?\n{0,}/gs, "")
                        .replace(/\s?\S?--\>/gs, "")
                        .replace(/\b(.*)\b/gs, "$1")
                        .split(/\s?,\s?/)
                        .filter(alias => alias !== "")
                );
            }
            State.next(State.AWAIT_DEFINITION);
        }
        else if (
            State.is(State.AWAIT_DEFINITION)
            && node.type === "text"
        ) {
            terms.getLatest().appendDescription(node.value);
        }
        else {
            return;
        }
    }
}

module.exports = api;
