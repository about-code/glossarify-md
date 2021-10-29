# Internals: Conceptual Layers

Conceptual layers and projects contributing to the layer

| Layer |     Project     |                          Conceptual purpose                           |
| ----- | --------------- | --------------------------------------------------------------------- |
| 4     | [glossarify-md] | cross-linking multiple markdown files                                 |
| 3     | [unified]       | umbrella project for *text file processing in general*                |
| 2     | [remark]        | unified *processor* for *markdown text file processing in particular* |
| 1     | [micromark]     | remarks internal markdown syntax tokenizer                            |
| 0     | [CommonMark]    | Informal Markdown Syntax Specification                                |

[glossarify-md] is built on [unified], an umbrella project for *text file processing in general*. We use unified with [remark], which in conceptual terms of unified is a *processor* for *Markdown text files in particular*. remark itself only supports the [CommonMark] specification via its *internal* [micromark] parser/tokenizer.

That's why you need to install additional [remark plug-ins][remark-plugins] when you need extended Markdown syntax. Those plug-ins then usually install and depend on a [micromark] extension to parse and tokenize that syntax. We omitted for simplicity that [glossarify-md] already installs [remark-gfm] to also support popular [GitHub Flavoured Markdown][GFM] syntax (e.g. tables and footnotes).

Unless told you by any [remark plug-in][remark-plugins] you won't likely have to install any micromark extensions yourself when using [glossarify-md]. Just stick with [remark plug-ins][remark-plugins] on layer 2. They should declare their [micromark] requirements for themselves.


[glossarify-md]: https://github.com/about-code/glossarify-md
[micromark]: https://github.com/micromark/
[remark]: https://github.com/remarkjs/remark
[remark-gfm]: https://npmjs.com/package/remark-gfm
[remark-plugins]: https://github.com/remarkjs/awesome-remark
[unified]: https://unifiedjs.com
[CommonMark]: https://commonmark.org
[GFM]: https://github.github.com/gfm/
