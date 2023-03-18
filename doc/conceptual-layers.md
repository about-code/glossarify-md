# [Internals: Conceptual Layers](#internals-conceptual-layers)

[Conceptual layers][1] of text processing by [glossarify-md🌎][2] and projects contributing to each layer

| Layer | Project              | Conceptual purpose                                                                                                                                                                       |
| ----- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4     | [glossarify-md🌎][2] | cross-linking multiple markdown files                                                                                                                                                    |
| 3     | [unified🌎][3]       | umbrella project for *text file processing in general*                                                                                                                                   |
| 2     | [remark🌎][4]        | [unified🌎][3] *processor* for *markdown text file processing in particular*. Offers access to an Abstract Syntax Tree ([mdAst🌎][5]) data structure grown from [micromark🌎][6] tokens. |
| 1     | [micromark🌎][6]     | remarks internal markdown syntax tokenizer                                                                                                                                               |
| 0     | [CommonMark🌎][7]    | Markdown Syntax Specification                                                                                                                                                            |

[glossarify-md🌎][2] is built on [unified🌎][3], an umbrella project for *text file processing in general*. We use unified with [remark🌎][4] which in conceptual terms of unified is a *processor* for *Markdown text files in particular*. remark itself is built on (or better *wrapping around*) [micromark🌎][6] which is a low-level parser/tokenizer operating on a stream of individual character symbols which drive a token state machine. micromark can be considered a technical implementation of the textual [CommonMark🌎][7] specification.

When looking for non-standard [Markdown syntax extensions][8] you should be looking for [remark🌎][4] [plug-ins][9]. Those plug-ins are likely to depend on and transitively install their preferred or required [micromark🌎][6] extension themselves. Others may operate on layer 2 using a simpler RegEx parsing. One plug-in [glossarify-md🌎][2] already installs itself is [remark-gfm🌎][10] which adds support for the popular [CommonMark🌎][7] syntax extension [GitHub Flavoured Markdown🌎][11] (tables, footnotes and more).

[1]: https://github.com/about-code/glossarify-md/tree/master/docconceptual-layers.md

[2]: https://github.com/about-code/glossarify-md "This project."

[3]: https://unifiedjs.com "unified is an umbrella project around text file processing in general."

[4]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[5]: https://github.com/syntax-tree/mdast "Specification and Implementation of a Markdown Abstract Syntax Tree."

[6]: https://github.com/micromark/ "A low-level extensible implementation of the CommonMark syntax specification (parsing and tokenizing)."

[7]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[8]: https://github.com/about-code/glossarify-md/tree/master/doc/markdown-syntax-extensions.md

[9]: https://github.com/about-code/glossarify-md/tree/master/doc/plugins.md

[10]: https://npmjs.com/package/remark-gfm "A remark syntax plug-in supporting GitHub Flavoured Markdown."

[11]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"
