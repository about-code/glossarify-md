const common = require("./common.js");
const Term = require("./term.js");
const path = require("path");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const uVisit = require("unist-util-visit");
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_stringify = require("remark-stringify");
const remark_link_headings = require("remark-autolink-headings");

const api = {};

/**
 * @private
 * @param {Context} context
 * @return {Promise<Term[]>} terms
 */
api.readTermDefinitions = function(context) {
    const {baseDir, outDir, glossaries} = context.opts;
    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: unified()
                    .use(remark_parse)
                    .use(common.printAst(context.opts.dev.printInputAst))  // Might be regex. /.*\/table\.md/g;
                    .use(remark_slug)
                    .use(remark_link_headings, {behavior: 'wrap'})
                    .use(terminator(context))
                    .use(common.printAst(context.opts.dev.printOutputAst))  // Might be regex. /.*\/table\.md/g;
                    .use(common.noopCompiler)
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
 * Terminator climbs along the shallow markdown syntax tree
 * where he picks up all those terms humans use to describe
 * their world. Once he finds a term he immediatly attempts
 * to put it into context.
 *
 * @private
 * @param {*} context
 */
function terminator(context) {
    const { glossaries, opts } = context;
    const { baseDir } = opts;

    return () => (tree, file) => {
        const glossaryKey = path.resolve(baseDir, file.path);
        const glossary = glossaries[glossaryKey];
        if (! glossary) {
            throw new Error("No glossary config found.");
        }

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
    return function visitor(node, index, parent) {
        const {terms} = context;
        if (node.type === "heading") {
            if (node.depth > 1) {
                // New term definition begins with a headline other than the title...
                State.next(State.AWAIT_LINK);;
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
            addNewTerm(terms, node.value, parent.url, glossary)
            State.next(State.AWAIT_DEFINITION | State.AWAIT_ALIAS);
        }
        else if (
            State.is(State.AWAIT_ALIAS)
            && node.type === "html"
        ) {
            if (/\<\!--\n?\s?Aliases:/g.test(node.value)) {
                terms[0].setAliases(
                    node.value
                        .replace(/\<\!--\s?\S?Aliases:\s?\n{0,}/gs, "")
                        .replace(/\s?\S?--\>/gs, "")
                        .replace(/\b(.*)\b/gs, "$1")
                        .split(/\s?,\s?/)
                );
            }
            State.next(State.AWAIT_DEFINITION);
        }
        else if (
            State.is(State.AWAIT_DEFINITION)
            && node.type === "text"
        ) {
            terms[0].appendDescription(node.value);
        }
        else {
            return;
        }
    }
}

// =================== Helpers ===================

function addNewTerm(terms, text, url, glossary) {
    const term = new Term({
        glossary: glossary,
        hint: glossary.termHint,
        anchor: url,
        term: text
    });
    // push the latest term to index 0 to have a
    // fixed position where to look it up when
    // inspecting its subsequent describing paragraph.
    terms.unshift(term);
    return terms;
}


module.exports = api;
