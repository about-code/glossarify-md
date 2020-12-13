const {syntax} = require("micromark-extension-wiki-link");
const {fromMarkdown} = require("mdast-util-wiki-link");

/**
 * The `[[toc]]` instruction is widely used by vuepress users to generate
 * Tables of Contents (ToC) and is officially advertised as a supported
 * markdown extension in vuepress v1.x. Vuepress itself depends on
 * "markdown-it-table-of-contents" [5] for ToC rendering.
 *
 * The [[toc]] processing instruction is acknowledged by CommonMark [1] as a
 * "Deployed Extension" [2]. Deployed Extensions are a CommonMark term and
 * effort to capture and evaluate the zoo of non-standardized but widely used
 * special-purpose syntax extensions or markdown "flavours" which often overlap
 * among each other or even collide. The most prominent flavour is
 * "GitHub Flavoured Markdown" (GFM).
 *
 * Nevertheless `[[foo]]` is actually invalid CommonMark. According to CommonMark
 * `[[foo]]` (without backticks) is a *link label* [4] due to the outer unescaped
 * brackets but it is in an invalid one because link labels "*must not* contain
 * unescaped inner brackets" according to CommonMark (v0.29) [4].
 *
 * Therefore remark-parse doesn't support the instruction on its own and
 * remark-stringify escapes it into `\[\[toc]]`. But this modifies the original
 * markdown breaking the [[toc]] instruction for vuepress users of glossarify-md.
 *
 * We could refer those users to configuring a custom `markerPattern` or another
 * extension like "markdown-it-toc-done-right" [6] which also interpret a pattern
 * `${toc}` that doesn't interfer with standardized markdown syntax. However, I
 * dismissed this option, since it would pose a barrier to vuepress users and
 * would ignore that [[toc]] is a popular instruction even acknowledged by
 * CommonMark.
 *
 * Instead we decided to utilize 'micromark-extension-wiki-link' to parse
 * the double-bracket syntax and 'mdast-util-wiki-link' to obtain an mdast node
 * which we provide our own toMarkdown() serializer for.
 *
 * [1]: https://spec.commonmark.org/0.29 CommonMark v0.29
 * [2]: https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions#processing-instruction CommonMark catalogue of "Deployed Extensions"
 * [3]: https://spec.commonmark.org/0.29/#shortcut-reference-link CommonMark v0.29 (Shortcut Link Reference)
 * [4]: https://spec.commonmark.org/0.29/#link-label CommonMark v0.29 (Link Label)
 * [5]: https://npmjs.com/package/markdown-it-table-of-contents
 * [6]: https://npmjs.com/package/markdown-it-toc-done-right
*/
const NODE_TYPE = "wikiLink";
const Node = {
    type: NODE_TYPE
    ,syntax
    ,fromMarkdown
    ,toMarkdown: function () {
        return {
            handlers: { [NODE_TYPE]: (node) => `[[${node.value}]]` }
        };
    }
};

module.exports.TocInstructionNode = Node;
