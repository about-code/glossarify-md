# Addendum: Conceptual Layers

Conceptual layers and projects contributing to the layer

| Layer |     Project     |                          Conceptual purpose                           |
| ----- | --------------- | --------------------------------------------------------------------- |
| 4     | [glossarify-md] | cross-linking multiple markdown files                                 |
| 3     | [unified]       | umbrella project for *text file processing in general*                |
| 2     | [remark]        | unified *processor* for *markdown text file processing in particular* |
| 1     | [micromark]     | remarks internal markdown syntax tokenizer                            |
| 0     | [CommonMark]    | Markdown Syntax Specification for your files                          |


[glossarify-md] is built on [unified], an umbrella project for *text file processing in general*. We use [unified] with [remark], which in conceptual terms of [unified] is a *processor* for *Markdown text files in particular*.

**When installing [remark plug-ins][remark-plugins]** you might need to know the remark version in use: *[glossarify-md] is already on [remark] 13+ with [micromark].* [micromark] is the parser/tokenizer implementation **internal** to [remark] as of version 13. Unless told you by any [remark plug-in][remark-plugins] you won't likely have to install any micromark extensions yourself when using [glossarify-md]. Just stick with [remark plug-ins][remark-plugins] on layers 2. They should declare their [micromark] requirements for themselves.


[glossarify-md]: https://github.com/about-code/glossarify-md
[micromark]: https://github.com/micromark/
[remark]: https://github.com/remarkjs/remark
[remark-plugins]: https://github.com/remarkjs/awesome-remark
[unified]: https://unifiedjs.com
[CommonMark]: https://commonmark.org
