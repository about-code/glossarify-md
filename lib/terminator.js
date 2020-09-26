const path = require("path");
const uVisit = require("unist-util-visit");

const {Term} = require("./model/term");
const {getNodeText, isHtmlComment} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");

/**
 * @typedef {import('./model/Context')} Context
 * @typedef {import('./model/glossary')} Glossary
 */

const api = {};

/**
 * Terminator parses glossary files and creates a term for each
 * heading in those files. The terms are being put into the
 * dictionary which is then used to look for terms when processing
 * the whole set of files.
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
    State.AWAIT_HEADING =  2;
    State.AWAIT_LINK = 4;
    State.AWAIT_ALIAS = 8;
    State.AWAIT_PARAGRAPH = 16;
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
            terms.add(new Term({
                glossary: glossary
                ,hint: glossary.termHint
                ,anchor: node.url
                ,term: getNodeText(node)
                ,ignoreCase: opts.ignoreCase
            }));
            State.next(State.AWAIT_PARAGRAPH | State.AWAIT_ALIAS);
        } else if (
            State.is(State.AWAIT_ALIAS)
            && isHtmlComment(node)
        ) {
            const aliases = parseAliases(node.value);
            if (aliases.length > 0) {
                terms.getLatest().setAliases(aliases);
            }
            State.next(State.AWAIT_PARAGRAPH);
        } else if (
            State.is(State.AWAIT_PARAGRAPH)
            && node.type === "paragraph"
        ) {
            terms.getLatest().appendDescription(getNodeText(node));
        } else if (
            !State.is(State.AWAIT_PARAGRAPH)
            && node.type === "paragraph"
        ) {
            State.next(State.AWAIT_HEADING);
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
