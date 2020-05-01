const remark_burger = require("remark-burger");
const remark_stringify = require("remark-stringify");

const api = {};

/**
 * This adds support for the [[toc]] processing instruction, which is
 * acknowledged by CommonMark [1] as a "Deployed Extension" [2]. Deployed
 * Extensions are a CommonMark term and effort to capture and evaluate the zoo
 * of non-standardized but widely used special-purpose syntax extensions or
 * markdown "flavours" which often overlap among each other or even collide, but
 * which often gained popularity and widespread adoption with a particular parser
 * or within a particular domain. The most prominent flavour is
 * "GitHub Flavoured Markdown" (GFM).
 *
 * Adding "support" for [[toc]] means that it generates its own AST node type
 * and has its own stringify output definition. The output definition is simply
 * [[toc]] again such that the syntax is simply "passed through" the
 * glossarify-md pipeline without any particular handling of it but also
 * without any modifications on output rendering which could be observed when
 * relying on remark's default processing, only.
 *
 * remark-parse doesn't support the instruction on its own but rather parses the
 * outer brackets into *text nodes* and the inner brackets including "toc" into
 * a node of type "link-reference" (see also [3]). By default remark-stringify
 * renders such an AST as `\[[toc]]`, so escaping the first opening bracket and
 * modifying the original markdown. It *must* do so because any `[[foo]]` is
 * actually invalid CommonMark. According to CommonMark `[[foo]]` is a
 * *link label* [4] due to the outer unescaped brackets but it is in an invalid
 * one becaus link labels "*must not* contain unescaped inner brackets" [4].
 *
 * The `[[toc]]` instruction is widely used by vuepress users to generate
 * Tables of Contents (ToC) and is officially advertised as a supported
 * markdown extension in vuepress v1.x. Vuepress itself depends on
 * "markdown-it-table-of-contents" [5] for ToC rendering. We could refer
 * those users to configuring a custom `markerPattern` or another extension like
 * "markdown-it-toc-done-right" [6] which also interpret a pattern `${toc}`
 * that doesn't interfer with standardized markdown syntax. However, this option
 * was dismissed since it would pose a vuepress integration barrier and would
 * ignore that [[toc]] is a popular instruction even acknowledged by CommonMark.
 *
 * [1]: https://spec.commonmark.org/0.29 CommonMark v0.29
 * [2]: https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions#processing-instruction CommonMark catalogue of "Deployed Extensions"
 * [3]: https://spec.commonmark.org/0.29/#shortcut-reference-link CommonMark v0.29 (Shortcut Link Reference)
 * [4]: https://spec.commonmark.org/0.29/#link-label CommonMark v0.29 (Link Label)
 * [5]: https://npmjs.com/package/markdown-it-table-of-contents
 * [6]: https://npmjs.com/package/markdown-it-toc-done-right
 */
api.withTocInstruction = function(opts) {
    remark_stringify.Compiler.prototype.visitors["ext-markdown-it-toc-instruction"] = function() {
        return "[[toc]]";
    };
    return remark_burger.call(this, Object.assign({
        beginMarker: "[[toc"
        ,endMarker: "]]"
        ,pattyName: "ext-markdown-it-toc-instruction"
        ,insertBefore: "link"
    }, opts));
};

module.exports = api;
