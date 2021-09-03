import { visit } from "unist-util-visit";
import { getNodeId, getNodeText, isHtmlComment } from "./ast/tools.js";
import { TermDefinitionNode } from "./ast/with/term-definition.js";
import { Glossary } from "./model/glossary.js";


/**
 * @typedef {import('./model/Context')} Context
 * @typedef {import('./model/glossary')} Glossary
 */

/**
 * Terminator parses glossary files and creates a term for each
 * heading in those files. The terms are being indexed and
 * looked up when processing the whole set of files.
 *
 * @private
 * @param {{context: Context}} args
 * @returns {(tree: Node, vFile: VFile) => Node} unifiedjs processor plug-in
 */
export function terminator(args) {
    const { context } = args;
    const { glossaries } = context.conf;
    const glossariesByPath = {};
    glossaries.map(g => glossariesByPath[context.resolvePath(g.file)] = g);
    return (tree, vFile) => {
        const glossaryKey = context.resolvePath(vFile.path);
        let glossaryConf = glossariesByPath[glossaryKey];
        if (glossaryConf) {
            vFile.isGlossary = true;
        } else {
            vFile.isGlossary = false;
            glossaryConf = new Glossary({
                file: vFile.path
                ,termHint: ""
                ,title: ""
            });
        }
        glossaryConf.vFile = vFile;
        visit(tree, getNodeVisitor(context, glossaryConf));
        return tree;
    };
}


/**
 * @private
 * @param {Context} context
 * @param {Glossary} glossary
 */
function getNodeVisitor(context, glossary) {

    const State = {};
    State.AWAIT_HEADING =  2;
    // State.AWAIT_LINK = 4;
    State.AWAIT_ALIAS = 8;
    State.AWAIT_PARAGRAPH = 16;
    State.active = State.AWAIT_HEADING;
    State.is = (state) => State.active & state;
    State.next = (nextState) => State.active = nextState;

    const {conf} = context;
    const {headingDepths} = conf.indexing;
    let heading = null;
    let termNode = null;

    return function visitor(node) {
        if (node.type === "heading") {
            heading = node;
            if (node.depth === 1) {
                glossary.title = getNodeText(node);
            }
            if (headingDepths[node.depth] === true) {
                termNode = new TermDefinitionNode ({
                    id: getNodeId(node)
                    ,value: getNodeText(node)
                    ,glossary: glossary
                    ,hint: glossary.termHint
                    ,headingDepth: heading.depth
                    ,anchor: `#${getNodeId(node)}`
                    ,ignoreCase: conf.ignoreCase
                });
                node.children.unshift(termNode);
                State.next(State.AWAIT_PARAGRAPH | State.AWAIT_ALIAS);
            } else {
                State.next(State.AWAIT_HEADING);
            }
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
