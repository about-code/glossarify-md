const path = require("path");
const uVisit = require("unist-util-visit");

const Term = require("./model/term");
const {getNodeText} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");

/**
 * @typedef {import('./model/Context')} Context
 * @typedef {import('./model/glossary')} Glossary
 */

const api = {};

/**
 * Terminator climbs along the shallow markdown syntax tree
 * where he picks up all those terms humans use to describe
 * their world. Once he finds a term he immediatly attempts
 * to put it into context.
 *
 * @private
 * @param {{context: Context}} opts
 * @returns {(tree: Node, file: VFile) => Node} unifiedjs processor plug-in
 */
api.terminator = function(opts) {
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
        uVisit(tree, getNodeVisitor(context, glossary));
        return tree;
    };
};


/**
 * @private
 * @param {Context} context
 * @param {Glossary} glossary
 */
function getNodeVisitor(context, glossary) {

    const State = {};
    State.NEW_GLOSSARY = 1;
    State.AWAIT_LINK = 2;
    State.AWAIT_LINK_TEXT = 4;
    State.AWAIT_DEFINITION = 8;
    State.AWAIT_ALIAS = 16;
    State.AWAIT_NEW_TERM =  32;
    State.active = State.NEW_GLOSSARY;
    State.is = (state) => State.active & state;
    State.next = (nextState) => State.active = nextState;

    const {terms, opts} = context;
    return function visitor(node, idx, parent) {
        if (node.type === "heading") {
            if (node.depth === 1) {
                glossary.title = getNodeText(node);
                State.next(State.NEW_GLOSSARY);
            } else if (node.depth > 1) {
                State.next(State.AWAIT_LINK);
            } else {
                State.next(State.NEW_GLOSSARY);
            }
        } else if (
            State.is(State.AWAIT_LINK)
            && node.type === "link"
            && parent.type === "heading"
        ) {
            State.next(State.AWAIT_LINK_TEXT);
        } else if (
            State.is(State.AWAIT_LINK_TEXT)
            && node.type === "text"
            && parent.type === "link"
        ) {
            terms.add(new Term({
                glossary: glossary
                ,hint: glossary.termHint
                ,anchor: parent.url
                ,term: node.value
                ,ignoreCase: opts.ignoreCase
            }));
            State.next(State.AWAIT_DEFINITION | State.AWAIT_ALIAS);
        } else if (
            State.is(State.AWAIT_ALIAS)
            && node.type === "html"
        ) {
            const aliases = parseAliases(node.value);
            if (aliases.length > 0) {
                terms.getLatest().setAliases(aliases);
            }

            State.next(State.AWAIT_DEFINITION);
        } else if (
            State.is(State.AWAIT_DEFINITION)
            && (
                node.type === "text"  ||
                node.type === "html"
            )
        ) {
            terms.getLatest().appendDescription(node.value);
        } else {
            return;
        }
    };
}

/**
 * @param {string} markup
 * @returns {string[]}
 */
function parseAliases(markup) {
    if (/<!--\n?\s?Aliases:/g.test(markup)) {
        return markup
            .replace(/<!--\s?\S?Aliases:\s?\n{0,}/gs, "")
            .replace(/\s?\S?-->/gs, "")
            .replace(/\b(.*)\b/gs, "$1")
            .split(/\s?,\s?/)
            .filter(alias => alias !== "");
    } else {
        return [];
    }

}

module.exports = api;
