/**
 * @typedef { import('micromark-util-types').Extension} Extension
 * @typedef { import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef { import('micromark-util-types').NormalizedExtension} NormalizedExtension
 * @typedef { import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef { import('mdast-util-to-markdown').Options} ToMarkdownOptions
 *
 * @interface NodeType
 * @property {() => Extension|HtmlExtension|NormalizedExtension} syntax
 * @property {() => FromMarkdownExtension } fromMarkdown
 * @property {() => ToMarkdownOptions } toMarkdown
 */

/**
 * Registers custom mdAst node types with unified(). Node types must
 * provide static functions
 * - `syntax()` as required by `micromarkExtensions`
 * - `fromMarkdown()` as required by `fromMarkdownExtensions`
 * - `toMarkdown` as required by `toMarkdownExtensions`
 * as micromarkExtension, fromMarkdownExtension and toMarkDownExtension.
 *
 * @param {NodeType|NodeTypes[]} nodeTypes
 * @returns
 */
export function withNodeType(nodeTypes) {

    if (! Array.isArray(nodeTypes)) {
        nodeTypes = [nodeTypes];
    }
    return function () {
        // https://github.com/unifiedjs/unified#processordatakey-value
        const data = this.data();
        for (let i = 0, len = nodeTypes.length; i < len; i++) {
            const nodeType = nodeTypes[i];
            add(data, "micromarkExtensions", nodeType.syntax());
            add(data, "fromMarkdownExtensions", nodeType.fromMarkdown());
            add(data, "toMarkdownExtensions", nodeType.toMarkdown());
        }
        return (tree) => tree;
    };
}

function add(data, field, value) {
    if (!value) {
        return;
    }
    if (data[field]) {
        data[field].push(value);
    } else {
        data[field] = [value];
    }
}
