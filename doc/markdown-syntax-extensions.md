# [Markdown Syntax Extensions](#markdown-syntax-extensions)

[doc-conceptual-layers]: ./conceptual-layers.md

[doc-plugins]: ./plugins.md

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

[remark-plugins]: https://github.com/remarkjs/awesome-remark

[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

glossarify-md supports CommonMark and GitHub Flavoured Markdown (GFM). Syntax not covered by these specifications may have no or worse, a wrong representation in the tool's Abstract Syntax Tree (mdAst). As a consequence it may not make it correctly into output documents. For example *Frontmatter* syntax is a Markdown syntax extension popularized by many static site generators:

*Frontmatter Syntax*

    ---
    key: This is a frontmatter
    ---

Without special support for it CommonMark compliant parsers like our remark parser will interpret the line of trailing dashes as *heading* markers and the text before them as *heading text*. So to make our parser aware of frontmatter syntax we need to enhance it.

**Since v5.0.0** we have opened glossarify-md to the [remark plug-in ecosystem][remark-plugins] and its support of additional syntaxes and tools. More see [Installing Plug-ins][doc-plugins].
