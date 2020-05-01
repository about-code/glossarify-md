# AST Node Type Extensions

This directory contains [remark-parse][4] Parser extensions which create additional AST node types for non-standard Markdown syntax extensions that are not supported by remark itself.

- Only syntaxes acknowledged by [CommonMark][1] as [*Deployed Extensions*][2] SHOULD be added.
- CommonMark recommendations for handling deployed extensions SHOULD be considered, if applicable.
- Node type names MUST follow the pattern `ext-[domain]-[name]-[class]` with optional variables in brackets and required variables in curly braces
  - The node type `ext-`prefix MAY be followed by a particular `domain` indicator (e.g. name of a parser or company which popularized the syntax)
  - The node type `name` SHOULD be followed by a `class` node type classification. It SHOULD use the same Classification as in the [CommonMark Deployed Extensions Catalogue][2].

  > Example: `"ext-markdown-it-toc-instruction"` for the [`[[toc]]` processing instruction][3]. *markdown-it* was used as the parser domain even though [markdown-it][5] doesn't support the instruction itself but because it popularized an extension mechansim which led to extensions such as [markdown-it-table-of-contents][6] or [markdown-it-toc-done-right][7].

- Syntax Extensions SHOULD be put behind a flag if they imply special processing
  - They MUST be put behind a flag if markdown output produced by *glossarify-md* differs from the markdown input due to evaluating the syntax
  - They MAY be put behind if output produced by *glossarify-md* and input are identical (no particular interpretation of the syntax but merely "pass-through")


[1]: https://spec.commonmark.org/0.29 "CommonMark v0.29"
[2]: https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions "CommonMark catalogue of Deployed Extensions"
[3]: https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions#processing-instruction "Processing Instructions acknowledged by CommonMark as Deployed Extensions"
[4]: https://npmjs.com/package/remark-parse "remark-parse"
[5]: https://npmjs.com/package/markdown-it "markdown-it"
[6]: https://npmjs.com/package/markdown-it-table-of-contents "markdown-it-table-of-contents"
[7]: https://npmjs.com/package/markdown-it-toc-done-right "markdown-it-toc-done-right"
