import { visit } from "unist-util-visit";
import { getNodeId, getNodeText, isHtmlComment } from "./ast/tools.js";
import { TermDefinitionNode } from "./ast/with/term-definition.js";
import { concatUrl, getFileLinkUrl } from "./path/tools.js";
import { parse as yaml } from "yaml";

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
            termNode.setTermAttributes(parseTermAttributes(htmlComment, glossVFile));
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
    if (/^<!--/.test(markup) && /-->$/.test(markup)) {
        const markup_ = markup
            .replace(/^<!--/, "")
            .replace(/-->$/, "");
        try {
            return yaml(markup_);
        } catch (err) {
            console.warn(`WARN: Term Attributes Syntax Error (YAML) in ${vFile.path}: ${err.message}`);
        }
        try {
            return JSON.parse(markup_);
        } catch (err) {
            console.warn(`WARN: Term Attributes Syntax Error (JSON) in ${vFile.path}: ${err.message} at: ${markup}`);
        }
        // Backwards compatibility. Deprecated. Consider removing with next major version.
        return parseAliases(markup) || {};
    }
    return {};
}

function parseAliases(markup) {
    if (/<!--\n?\s?Aliases:/g.test(markup)) {
        if (/\n.*-->/.test(markup)) {
            console.warn(`
WARN: Comment after term heading is neither conforming to YAML nor JSON Term Attribute Syntax.
NOTE: *Sloppy* Multi-line 'Aliases: ' Syntax is deprecated. To denote multiple aliases either 
use a single line with aliases separated by comma, for example 
<!--
  aliases: foo, bar, etc. 
--> 
or a YAML list (note that YAML is sensitive about tabs and whitespaces)
<!-- 
  aliases:
  - foo
  - bar
  - etc
-->
`);
        }
        return {
            aliases: markup
                .replace(/<!--\s?\S?Aliases:\s?\n{0,}/gs, "")
                .replace(/\s?\S?-->/gs, "")
                .replace(/\b(.*)\b/gs, "$1")
                .split(/\s?,\s?/)
                .filter(alias => alias !== "")
        };
    }
}
