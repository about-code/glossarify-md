# [Internals: Conceptual Layers](#internals-conceptual-layers)

<!--
aliases: Conceptual Layers
-->

[Conceptual layers][1] of text processing by [glossarify-md][2] and projects contributing to each layer

| Layer | Project            | Conceptual purpose                                                                                                                                                                          |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4     | [glossarify-md][2] | [cross-linking][3] multiple markdown files                                                                                                                                                  |
| 3     | [unified 🌎][4]    | umbrella project for *text file processing in general*                                                                                                                                      |
| 2     | [remark 🌎][5]     | [unified 🌎][4] *processor* for *markdown text file processing in particular*. Offers access to an Abstract Syntax Tree ([mdAst 🌎][6]) data structure grown from [micromark 🌎][7] tokens. |
| 1     | [micromark 🌎][7]  | remarks internal markdown syntax tokenizer                                                                                                                                                  |
| 0     | [CommonMark 🌎][8] | Markdown Syntax Specification                                                                                                                                                               |

[glossarify-md][2] is built on [unified 🌎][4], an umbrella project for *text file processing in general*. We use unified with [remark 🌎][5] which in conceptual terms of unified is a *processor* for *Markdown text files in particular*. remark itself is built on (or better *wrapping around*) [micromark 🌎][7] which is a low-level parser/tokenizer operating on a stream of individual character symbols which drive a token state machine. micromark can be considered a technical implementation of the textual [CommonMark 🌎][8] specification.

When looking for non-standard [Markdown syntax extensions][9] you should be looking for [remark 🌎][5] [plug-ins][10]. Those plug-ins are likely to depend on and transitively [install][11] their preferred or required [micromark 🌎][7] extension themselves. Others may operate on layer 2 using a simpler RegEx parsing. One plug-in [glossarify-md][2] already installs itself is [remark-gfm 🌎][12] which adds support for the popular [CommonMark 🌎][8] syntax extension [GitHub Flavoured Markdown 🌎][13] (tables, footnotes and more).

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/conceptual-layers.md#internals-conceptual-layers "Conceptual layers of text processing by glossarify-md and projects contributing to each layer glossarify-md is built on unified, an umbrella project for text file processing in general."

[2]: https://github.com/about-code/glossarify-md

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#cross-linking "ⓘ Since: v5.0.0"

[4]: https://unifiedjs.com "unified is an umbrella project around text file processing in general."

[5]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[6]: https://github.com/syntax-tree/mdast "Specification and Implementation of a Markdown Abstract Syntax Tree."

[7]: https://github.com/micromark/ "A low-level extensible implementation of the CommonMark syntax specification (parsing and tokenizing)."

[8]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/markdown-syntax-extensions.md#markdown-syntax-extensions "glossarify-md supports CommonMark and GitHub Flavoured Markdown (GFM)."

[10]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins.md#installing-and-configuring-plug-ins "The following example demonstrates how to install remark-frontmatter, a syntax plug-in from the remark plug-in ecosystem which makes glossarify-md (resp."

[11]: https://github.com/about-code/glossarify-md/blob/master/doc/install.md#install

[12]: https://npmjs.com/package/remark-gfm "A remark syntax plug-in supporting GitHub Flavoured Markdown."

[13]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"
