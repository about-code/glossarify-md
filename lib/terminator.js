import { visit } from "unist-util-visit";
import { getNodeId, getNodeText, isHtmlComment } from "./ast/tools.js";
import { TermDefinitionNode } from "./ast/with/term-definition.js";
import { concatUrl, getFileLinkUrl } from "./path/tools.js";

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
 * @param {Context} context
 * @returns {(tree: Node, vFile: VFile) => Node} unifiedjs processor plug-in
 */
export function terminator(context) {
    return (tree, vFile) => {
        visit(tree, getNodeVisitor(context, vFile));
        return tree;
    };
}


/**
 * @private
 * @param {Context} context
 * @param {VFile} glossVFile
 */
function getNodeVisitor(context, glossVFile) {

    const State = {};
    State.AWAIT_HEADING =  2;
    State.AWAIT_ALIAS = 4;
    State.AWAIT_PARAGRAPH = 8;
    State.active = State.AWAIT_HEADING;
    State.is = (state) => State.active & state;
    State.next = (nextState) => State.active = nextState;

    const {indexing, ignoreCase} = context.conf;
    const headingDepths = indexing.headingDepths;
    const termHint = glossVFile.glossConf.termHint;

    let termNode = null;
    return function visitor(node) {
        if (node.type === "heading") {
            const headingDepth = node.depth;
            if (headingDepth === 1) {
                glossVFile.glossConf.title = getNodeText(node);
            }
            if (headingDepths[headingDepth] === true) {
                const headingId = getNodeId(node);
                const headingIdPlain = node.data.idPlain;
                const term = getNodeText(node);
                termNode = new TermDefinitionNode({
                    uri: getTermUri(context, glossVFile, headingId)
                    ,value: term
                    ,glossVFile: glossVFile
                    ,hint: termHint
                    ,headingId: headingId
                    ,headingIdPlain: headingIdPlain
                    ,headingDepth: headingDepth
                    ,anchor: `#${headingId}`
                    ,ignoreCase: ignoreCase
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
            const htmlComment = node.value;
            const termAttrs = parseAliases(htmlComment);
            if (! termAttrs || termAttrs.length === 0) {
                termNode.setTermAttributes(parseTermAttributes(htmlComment, glossVFile));
            } else { // Backwards Compatibility
                termNode.setAliases(termAttrs);
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

function getTermUri(context, glossVFile, headingId) {
    const {outDir, linking} = context.conf;
    const baseUrl = linking.baseUrl;
    let vocabUri = glossVFile.glossConf.uri;
    if (vocabUri) {
        return `${vocabUri}${headingId}`;
    } else {
        const termLink = getFileLinkUrl(context, outDir, glossVFile.path, headingId);
        vocabUri = baseUrl || "";
        if (linking.paths === "absolute" && baseUrl) {
            return termLink;
        } else if (linking.paths === "absolute") {
            return concatUrl(vocabUri, termLink.replace(outDir, ""), "");
        } else if (linking.paths === "relative") {
            return concatUrl(vocabUri, termLink.replace("./", "").replace("../", ""), "");
        } else {
            return concatUrl(vocabUri, headingId, "");
        }
    }
}

function parseTermAttributes(markup, vFile) {
    try {
        if (/^<!--{/.test(markup) && /\}-->$/.test(markup)) {
            return JSON.parse(markup
                .replace(/^<!--/, "")
                .replace(/-->$/, "")
            );
        } else {
            return [];
        }
    } catch (err) {
        console.warn(`${vFile.path}: ${err.message} in\n${markup}`);
        return [];
    }
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
