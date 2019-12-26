/**
 * This software is a modified copy of
 *
 *   'remark-regex-linkify'
 *   License: The MIT License (MIT)
 *   Url: https://gitlab.com/staltz/remark-linkify-regex/
 *   Copyright (c) 2018 André Staltz (staltz.com)
 *
 * Any modifications are subject to
 *
 *   License: The MIT License (MIT)
 *   Copyright (c) 2019 Andreas Martin (https://github.com/about-code)
 *
 * -----------------------------------------------------------------------------
 *
 *  The MIT License (MIT)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
const visitWithParents = require("unist-util-visit-parents");
const flatMap = require("unist-util-flatmap");

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

function buildTextNode(props) {
    return {type: "text", value: props.value};
}

function buildLinkNode(props, children) {
    return {
        type: "link"
        ,title: props.title ? props.title : null
        ,url: props.url
        ,children
    };
}

function n(type, props, children) {
    if (type === "text") {
        return buildTextNode(props, children);
    }
    if (type === "link") {
        return buildLinkNode(props, children);
    }
    throw new Error("mdast hyperscript not supported for type " + type);
}

const isWordChar = /^[a-zA-Z0-9\-_\u00D8-\u00F6](.*)/iu;
function isWordFragment(prevSlice, nextSlice) {
    return (prevSlice && isWordChar.test(prevSlice.substr(-1, 1))) || (nextSlice && isWordChar.test(nextSlice));
}

function splitTextNode(textNode, inputRegex, callback) {
    let oldText = textNode.value;
    let regex = notInMarkdownLink(removeExtremes(inputRegex), "g");
    let slices = oldText.split(regex);
    let newNodes = [];
    let prevNode = null;
    slices.forEach((slice, index) => {
        if (regex.test(slice) && !isWordFragment(slices[index-1], slices[index+1])) {
        // Current slice is a complete word and matches the search RegExp.
        // See also [1].
            let linkNode = n("link", {url: slice}, [n("text", {value: slice})]);
            if (callback) {
                const modifiedLink = callback(linkNode);
                if (modifiedLink) {
                    linkNode = modifiedLink;
                }

            }
            newNodes.push(linkNode);
            prevNode = linkNode;
        } else if (prevNode && prevNode.type === "text") {
        // If there's a word-split join subsequent text fragments into single node
            prevNode.value += slice;
        } else {
            const textNode = n("text", {value: slice});
            newNodes.push(textNode);
            prevNode = textNode;
        }
    });
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
 * @param {Node} tree The AST node to start regExp search at
 * @param {RegExp} regex The regular expression to match against
 * @param {(Node) => Node} callback The callback gets a link node and might return a modified link node.
 */
function linkifyRegex(tree, regex, callback) {
    visitWithParents(tree, "text", (textNode, parents) => {
        const parent = parents[parents.length - 1];
        if (parents.length > 0 && (
            parent.type === "link" ||
          parent.type === "linkReference"
        )) {
            textNode._ignoreMe = true;
            return;
        }
    });

    flatMap(tree, node => {
        if (node.type !== "text") {
            return [node];
        }

        if (node._ignoreMe) {
            delete node._ignoreMe;
            return [node];
        }
        return splitTextNode(node, regex, callback);
    });
    return tree;
}

module.exports = linkifyRegex;
