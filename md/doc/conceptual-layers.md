# Internals: Conceptual Layers

[CommonMark]: https://commonmark.org
[doc-syntax-extensions]: ./markdown-syntax-extensions.md
[GFM]: https://github.github.com/gfm/
[glossarify-md]: https://github.com/about-code/glossarify-md
[mdast]: https://github.com/syntax-tree/mdast
[micromark]: https://github.com/micromark/
[remark]: https://github.com/remarkjs/remark
[remark-gfm]: https://npmjs.com/package/remark-gfm
[remark-plugins]: https://github.com/remarkjs/awesome-remark
[unified]: https://unifiedjs.com

Conceptual layers of text processing by [glossarify-md] and projects contributing to each layer

| Layer |     Project     |                          Conceptual purpose                           |
| ----- | --------------- | --------------------------------------------------------------------- |
| 4     | [glossarify-md] | cross-linking multiple markdown files                                 |
| 3     | [unified]       | umbrella project for *text file processing in general*                |
| 2     | [remark]        | unified *processor* for *markdown text file processing in particular*. Offers access to an Abstract Syntax Tree ([mdast]) data structure grown from micromark tokens.|
| 1     | [micromark]     | remarks internal markdown syntax tokenizer                            |
| 0     | [CommonMark]    | Markdown Syntax Specification                                         |


[glossarify-md] is built on [unified], an umbrella project for *text file processing in general*. We use unified with [remark] which in conceptual terms of unified is a *processor* for *Markdown text files in particular*. remark itself is built on (or better *wrapping around*) [micromark] which is a low-level parser/tokenizer operating on a stream of individual character symbols which drive a token state machine. [micromark] can be considered a technical implementation of the textual [CommonMark] specification.

When looking for non-standard [syntax extensions][doc-syntax-extensions] you should be looking for [remark plug-ins][remark-plugins]. Those plug-ins are likely to depend on and transitively install their preferred or required [micromark] extension themselves. Others may operate on layer 2 using a simpler RegEx parsing. One plug-in [glossarify-md] already installs itself is [remark-gfm] which adds support for the popular CommonMark syntax extension [GitHub Flavoured Markdown][GFM] (tables, footnotes and more).
