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
    regex.source + '(?! *\\))(?! *])',
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

function h(type, props, children) {
  if (type === 'text') return buildTextNode(props, children);
  if (type === 'link') return buildLinkNode(props, children);
  throw new Error('mdast hyperscript not supported for type ' + type);
}

function splitTextNode(textNode, inputRegex, callback) {
  const oldText = textNode.value;
  const regex = notInMarkdownLink(removeExtremes(inputRegex), 'g');
  const newNodes = [];
  let startTextIdx = 0;
  let output;
  while ((output = regex.exec(oldText)) !== null) {
    const endTextIdx = output.index;
    if (startTextIdx !== endTextIdx) {
      newNodes.push(
        h('text', {value: oldText.slice(startTextIdx, endTextIdx)}),
      );
    }
    const feedId = output[0];
    let linkNode = h('link', {url: feedId}, [h('text', {value: feedId})]);
    if (callback) {
        const modifiedLink = callback(linkNode);
        if (modifiedLink) {
            linkNode = modifiedLink;
        }
    }
    newNodes.push(linkNode);
    startTextIdx = regex.lastIndex;
  }
  const remainingText = oldText.slice(startTextIdx);
  if (remainingText.length > 0) {
    newNodes.push(h('text', {value: remainingText}));
  }
  return newNodes;
}

/**
 *
 * @param {*} regex
 * @param {*} callback The callback gets a link node and might return a modified link node.
 */
function linkifyRegex(regex, callback) {

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
      return splitTextNode(node, regex, callback);
    });

    return ast;
  };
}

module.exports = linkifyRegex;
