# [Markdown Syntax Extensions](#markdown-syntax-extensions)

<!--
aliases: Markdown syntax extensions
-->

[glossarify-md][1] supports [CommonMark 🌎][2] and [GitHub Flavoured Markdown 🌎][3] (GFM). Syntax not covered by these specifications may have no or worse, a wrong representation in the tool's Abstract Syntax Tree ([mdAst 🌎][4]). As a consequence it may not make it correctly into output documents. For example *Frontmatter* syntax is a Markdown syntax extension popularized by many static site generators:

*Frontmatter Syntax*

    ---
    key: This is a frontmatter
    ---

Without special support for it [CommonMark 🌎][2] compliant parsers like our [remark 🌎][5] parser will interpret the line of trailing dashes as *heading* markers and the text before them as *heading text*. So to make our parser aware of frontmatter syntax we need to enhance it.

**Since v5.0.0** we have opened [glossarify-md][1] to the [remark 🌎][5] [plug-in ecosystem 🌎][6] and its support of additional syntaxes and tools. More see [Installing Plug-ins][7] and [Writing a Plug-in][8].

[1]: https://github.com/about-code/glossarify-md

[2]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[3]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"

[4]: https://github.com/syntax-tree/mdast "Specification and Implementation of a Markdown Abstract Syntax Tree."

[5]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[6]: https://github.com/remarkjs/awesome-remark "A curated list of remark plug-ins."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins.md#installing-and-configuring-plug-ins "The following example demonstrates how to install remark-frontmatter, a syntax plug-in from the remark plug-in ecosystem which makes glossarify-md (resp."

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins-dev.md#writing-a-plug-in
