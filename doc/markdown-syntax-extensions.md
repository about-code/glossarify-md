# [Markdown Syntax Extensions](#markdown-syntax-extensions)

[doc-conceptual-layers]: ./conceptual-layers.md

[doc-plugins]: ./plugins.md

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

[remark-plugins]: https://github.com/remarkjs/awesome-remark

[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

[vuepress][1]: [https://vuepress.vuejs.org][2]

[glossarify-md][3] supports [CommonMark][4] and \[[GitHub Flavoured Markdown][5] (GFM)]\[GFM]. Syntax not covered by these specifications may have no or worse, a wrong representation in the tool's \[Abstract Syntax Tree]\[mdast]. As a consequence it may not make it correctly into output documents. For example *Frontmatter* syntax is a Markdown syntax extension popularized by many static site generators:

*Frontmatter Syntax*

    ---
    key: This is a frontmatter
    ---

Without special support for it [CommonMark][4] compliant parsers like our [remark][6] parser will interpret the line of trailing dashes as *heading* markers and the text before them as *heading text*. So to make our parser aware of frontmatter syntax we need to enhance it.

**Since v5.0.0** we have opened [glossarify-md][3] to the [remark plug-in ecosystem][remark-plugins] and its support of additional syntaxes and tools. More see [Installing Plug-ins][doc-plugins].

[1]: https://vuepress.vuejs.org "A static website generator translating markdown files into a website powered by [vuejs]."

[2]: https://vuepress.vuejs.org

[3]: https://github.com/about-code/glossarify-md "This project."

[4]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[5]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"

[6]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."
