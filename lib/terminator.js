const uVisit = require("unist-util-visit");

const {TermDefinitionNode} = require("./ast/with/term-definition");
const {getNodeText, isHtmlComment} = require("./ast/tools");
const {Glossary} = require("./model/glossary");

/**
 * @typedef {import('./model/Context')} Context
 * @typedef {import('./model/glossary')} Glossary
 */

const api = {};

/**
 * Terminator parses glossary files and creates a term for each
 * heading in those files. The terms are being indexed and
 * looked up when processing the whole set of files.
 *
 * @private
 * @param {{context: Context}} args
 * @returns {(tree: Node, vFile: VFile) => Node} unifiedjs processor plug-in
 */
api.terminator = function(args) {
    const { context } = args;
    const { glossaries } = context.conf;
    const glossariesByPath = {};
    glossaries.map(g => glossariesByPath[context.resolvePath(g.file)] = g);
    return (tree, vFile) => {
        const glossaryKey = context.resolvePath(vFile.path);
        const glossaryConf = glossariesByPath[glossaryKey] || new Glossary({
            file: vFile.basename
            ,termHint: ""
            ,title: ""
        });
        // vFile.isGlossary = true;
        glossaryConf.vFile = vFile;
        uVisit(tree, getNodeVisitor(context, glossaryConf));
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

    const {conf} = context;
    let termNode = null;
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
            termNode = new TermDefinitionNode ({
                value: getNodeText(node)
                ,glossary: glossary
                ,hint: glossary.termHint
                ,anchor: node.url
                ,ignoreCase: conf.ignoreCase
            });
            parent.children.unshift(termNode);
            State.next(State.AWAIT_PARAGRAPH | State.AWAIT_ALIAS);
        } else if (
            State.is(State.AWAIT_ALIAS)
            && isHtmlComment(node)
        ) {
            const aliases = parseAliases(node.value);
            if (aliases.length > 0) {
                termNode.setAliases(aliases);
            }
            State.next(State.AWAIT_PARAGRAPH);
        } else if (
            State.is(State.AWAIT_PARAGRAPH)
            && node.type === "paragraph"
        ) {
            termNode.appendDescription(getNodeText(node));
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
