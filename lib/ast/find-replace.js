import { text } from "mdast-builder";
import flatMap from "unist-util-flatmap";
import { isHtmlClosedTag, isHtmlClosingTag, isHtmlOpenTag } from "./tools.js";

function removeExtremes(regex, optionalFlags) {
    return new RegExp(
        regex.source.replace(/^\^/, "").replace(/\$$/, ""),
        (optionalFlags || "") + (regex.flags || "")
    );
}

function notInMarkdownLink(regex, optionalFlags) {
    return new RegExp(
        regex.source + "(?! *\\)\\[)(?! *\\])",
        (optionalFlags || "") + (regex.flags || "")
    );
}

const isWordChar = /^[a-zA-Z0-9\-_\u00D8-\u00F6](.*)/iu;
function isWordFragment(prevSlice, nextSlice) {
    return (
        prevSlice && isWordChar.test(prevSlice.substr(-1, 1))
    ) || (
        nextSlice && isWordChar.test(nextSlice)
    );
}

function splitTextNode(textNode, inputRegex, callback) {
    let oldText = textNode.value;
    let regex = notInMarkdownLink(removeExtremes(inputRegex), "g");
    let slices = oldText.split(regex);
    let newNodes = [];
    let prevNode = null;
    for (let i = 0, len = slices.length; i < len; i++) {
        const slice = slices[i];
        if (regex.test(slice) && !isWordFragment(slices[i-1], slices[i+1])) {
            // Current slice is a complete word and matches the search RegExp.
            // See also [1].
            let insertNode = callback(slice);
            newNodes.push(insertNode);
            prevNode = insertNode;
        } else if (prevNode && prevNode.type === "text") {
            // If there's a word-split join subsequent text fragments into
            // single node
            prevNode.value += slice;
        } else {
            const textNode = text(slice);
            newNodes.push(textNode);
            prevNode = textNode;
        }
    }
    return newNodes;

    // Implementation Notes:
    // [1] Create a link node if the current slice matches the term regex
    // AND if the subsequent slice doesn't begin with a word character.
    // This (still unsatisfactory) condition is required (unfortunately)
    // because we can't split words reliably based on a \b(term)\b regexp
    // using word boundaries \b. Due to limited unicode support for JS RegExps
    // \b fails to detect boundaries for term's with the first or last letter
    // being non-ASCII letters as they exist for many languages like German
    // (ÄÖÜäöüß), French (é) etc. To still detect glossary terms like
    // 'Äquator' (equator) we have to omit \b and use a regex /(term)/gu.
    // But this also detects substrings in a word so splitting a sentence by
    // such a regex can result in word-splits. With a glossary term 'Äquator'
    // a compound term 'Äquatorregion' would be split into 'Äquator|region', or
    // a link node and text node, respectively. The second condition thus aims to
    // reduce the likelihood of such word-splits, even though we are aware that
    // this is still a workaround which might fail in yet unknown constellations.
}

/**
 * Searches the given tree for phrases matching against a regular expression. Any
 * match will trigger a callback which receives the matched phrase. The callback
 * is expected to return a new AST node which replaces the phrase.
 *
 * Replacement works by slicing the text node into two text nodes and inserting
 * the new AST node returned by the callback in between.
 *
 * @param {Node} tree The AST node to start regExp search at
 * @param {RegExp} regex The regular expression to match against
 * @param {(Node) => Node} callback
 */
export function findReplace(tree, regex, callback) {
    let htmlDepth = 0;
    flatMap(tree, (node, index, parent) => {
        const nodeType = node.type;
        const parentType = parent ? parent.type : "";

        if (nodeType === "html") {
            if (isHtmlOpenTag(node) && !isHtmlClosedTag(node)) {
                htmlDepth++;
            } else if (isHtmlClosingTag(node)) {
                htmlDepth--;
            }
        }
        if (nodeType !== "text" || htmlDepth > 0) {
            return [node];
        } else if (parent && (
            parentType === "link" ||
            parentType === "linkReference" ||
            parentType === "heading" ||
            parentType === "blockquote" ||
            parentType === "html"
        )) {
            return [node];
        } else {
            return splitTextNode(node, regex, callback);
        }
    });
    return tree;
}
