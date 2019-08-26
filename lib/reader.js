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

        uVisit(tree, getTermVisitor(terms, glossary));
        return tree;
    }
}


const State = function() {};
State.NEW_GLOSSARY = "ng";
State.AWAIT_LINK = "li";
State.AWAIT_LINK_TEXT = "lt";
State.AWAIT_DEFINITION = "df";
State.AWAIT_NEW_TERM =  "nt";
State.active = State.NEW_GLOSSARY;
State.is = (state) => State.active === state;
State.next = (nextState) => State.active = nextState;


/**
 * @private
 * @param {@} terms
 * @param {*} glossary
 */
function getTermVisitor(terms, glossary) {
    return function visitor(node, index, parent) {
        if (node.type === "heading") {
            if (node.depth > 1) {
                // New term definition begins with a headline other than the title...
                State.next(State.AWAIT_LINK);;
            } else {
                State.next(State.NEW_GLOSSARY);
            }
        } else if (
            State.is(State.AWAIT_LINK)
            && node.type === "link"
            && parent
            && parent.type === "heading"
        ) {
            State.next(State.AWAIT_LINK_TEXT)
        } else if (
            State.is(State.AWAIT_LINK_TEXT)
            && node.type === "text"
            && parent
            && parent.type === "link"
        ) {
            const term = new Term({
                glossary: glossary,
                hint: glossary.termHint,
                anchor: parent.url,
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
        } else {
            return;
        }
    }
}

// =================== Helpers ===================

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

module.exports = api;
