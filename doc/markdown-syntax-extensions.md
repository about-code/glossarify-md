# [Markdown Syntax Extensions](#markdown-syntax-extensions)

[doc-conceptual-layers]: ./conceptual-layers.md

[doc-plugins]: ./plugins.md

[CommonMark]: https://www.commonmark.org

[GFM]: https://github.github.com/gfm/

[glossarify-md]: https://github.com/about-code/glossarify-md

[mdast]: https://github.com/syntax-tree/mdast

[micromark]: https://github.com/micromark/

[remark]: https://github.com/remarkjs/remark

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

[remark-plugins]: https://github.com/remarkjs/awesome-remark

[unified]: https://unifiedjs.com

[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

[vuepress]: https://vuepress.vuejs.org

[glossarify-md] supports [CommonMark] and [GitHub Flavoured Markdown (GFM)][GFM]. Syntax not covered by these specifications may have no or worse, a wrong representation in the tool's [Abstract Syntax Tree][mdast]. As a consequence it may not make it correctly into output documents. For example *Frontmatter* syntax is a Markdown syntax extension popularized by many static site generators:

*Frontmatter Syntax*

    ---
    key: This is a frontmatter
    ---

Without special support for it [CommonMark] compliant parsers like our [remark] parser will interpret the line of trailing dashes as *heading* markers and the text before them as *heading text*. So to make our parser aware of frontmatter syntax we need to enhance it.

**Since v5.0.0** we have opened [glossarify-md] to the [remark plug-in ecosystem][remark-plugins] and its support of additional syntaxes and tools. More see [Installing Plug-ins][doc-plugins].
