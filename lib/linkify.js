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
const visitWithParents = require('unist-util-visit-parents');
const flatMap = require('unist-util-flatmap');

function removeExtremes(regex, optionalFlags) {
  return new RegExp(
    regex.source.replace(/^\^/, '').replace(/\$$/, ''),
    (optionalFlags || "") + (regex.flags || ""),
  );
}

function notInMarkdownLink(regex, optionalFlags) {
  return new RegExp(
    regex.source + '(?! *\\))(?! *\\])',
    (optionalFlags || "") + (regex.flags || ""),
  );
}

function buildTextNode(props) {
  return {type: 'text', value: props.value};
}

function buildLinkNode(props, children) {
  return {
    type: 'link',
    title: props.title ? props.title : null,
    url: props.url,
    children,
  };
}

function n(type, props, children) {
  if (type === 'text') return buildTextNode(props, children);
  if (type === 'link') return buildLinkNode(props, children);
  throw new Error('mdast hyperscript not supported for type ' + type);
}

function splitTextNode(textNode, inputRegex, term, callback) {
  let oldText = textNode.value;
  let regex = notInMarkdownLink(removeExtremes(inputRegex), 'g');
  let slices = oldText.split(regex);
  let newNodes = slices
      .map((slice, index) => {
          if (regex.test(slice)
            && !/^[a-zA-Z0-9_\u00D8-\u00F6](.*)/iu.test(slices[index+1]) // [1]
          ) {
            let linkNode = n('link', {url: slice}, [n('text', {value: slice})]);
            if (callback) {
              const modifiedLink = callback(linkNode);
              if (modifiedLink) {
                  linkNode = modifiedLink;
              }
            }
            return linkNode;
          } else {
            return n('text', {value: slice});
          }
          // Implementation Note:
          // [1] Create a link node if the current slice matches the term regex
          // AND if the subsequent slice doesn't begin with a word character.
          // This (still unsatisfactory) condition is required (unfortunately)
          // since we can't split words reliably based on a \b(term)\b regexp
          // using word boundaries \b. Such an expression fails to detect term's
          // where the first or last character is an arbitrary non-ASCII char as
          // they exist for many languages like in German (ÄÖÜäöüß), French (é)
          // etc. To still detect glossary terms like 'Äquator' (equator) we
          // have to omit \b to use a regex /(term)/. Yet this can result in
          // word splits. E.g. if there's a term 'Äquatorregion' in the text
          // it would be split into 'Äquator|region' inserting a link node and
          // text node. Esp. when using term hints, the whole word would become
          // unreadable. The second condition aims to reduce the likelihood of
          // in-word-linkfication but we are fully aware that this is still
          // a work around might producing word splits in some yet unknown
          // constellations.
      });
  return newNodes;
}

/**
 *
 * @param {*} regex
 * @param {*} callback The callback gets a link node and might return a modified link node.
 */
function linkifyRegex(regex, term, callback) {

  return () => ast => {
    visitWithParents(ast, 'text', (textNode, parents) => {
      const parent = parents[parents.length - 1];
      if (parents.length > 0 && (
          parent.type === 'link' ||
          parent.type === "linkReference"
      )) {
        textNode._ignoreMe = true;
        return;
      }
    });

    flatMap(ast, node => {
      if (node.type !== 'text') {
        return [node];
      }
      if (node._ignoreMe) {
        delete node._ignoreMe;
        return [node];
      }
      return splitTextNode(node, regex, term, callback);
    });
    return ast;
  };
}

module.exports = linkifyRegex;
