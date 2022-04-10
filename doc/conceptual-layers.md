# [Internals: Conceptual Layers](#internals-conceptual-layers)

[doc-syntax-extensions]: ./markdown-syntax-extensions.md

[remark-gfm]: https://npmjs.com/package/remark-gfm

[remark-plugins]: https://github.com/remarkjs/awesome-remark

Conceptual layers of text processing by [glossarify-md][1] and projects contributing to each layer

| Layer | Project            | Conceptual purpose                                                                                                                                                                 |
| ----- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4     | [glossarify-md][1] | cross-linking multiple markdown files                                                                                                                                              |
| 3     | [unified][2]       | umbrella project for *text file processing in general*                                                                                                                             |
| 2     | [remark][3]        | [unified][2] *processor* for *markdown text file processing in particular*. Offers access to an Abstract Syntax Tree ([mdAst][4]) data structure grown from [micromark][5] tokens. |
| 1     | [micromark][5]     | remarks internal markdown syntax tokenizer                                                                                                                                         |
| 0     | [CommonMark][6]    | Markdown Syntax Specification                                                                                                                                                      |

[glossarify-md][1] is built on [unified][2], an umbrella project for *text file processing in general*. We use unified with [remark][3] which in conceptual terms of unified is a *processor* for *Markdown text files in particular*. remark itself is built on (or better *wrapping around*) [micromark][5] which is a low-level parser/tokenizer operating on a stream of individual character symbols which drive a token state machine. micromark can be considered a technical implementation of the textual [CommonMark][6] specification.

When looking for non-standard [syntax extensions][doc-syntax-extensions] you should be looking for [remark plug-ins][remark-plugins]. Those plug-ins are likely to depend on and transitively install their preferred or required [micromark][5] extension themselves. Others may operate on layer 2 using a simpler RegEx parsing. One plug-in [glossarify-md][1] already installs itself is [remark-gfm] which adds support for the popular [CommonMark][6] syntax extension [GitHub Flavoured Markdown][7] (tables, footnotes and more).

[1]: https://github.com/about-code/glossarify-md "This project."

[2]: https://unifiedjs.com "unified is an umbrella project around text file processing in general."

[3]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[4]: https://github.com/syntax-tree/mdast "Specification and Implementation of a Markdown Abstract Syntax Tree."

[5]: https://github.com/micromark/ "A low-level extensible implementation of the CommonMark syntax specification (parsing and tokenizing)."

[6]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[7]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"
