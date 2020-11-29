# AST Node Type Extensions

This directory contains [remark-parse][4] extensions which add additional AST node types not supported by remark itself.

## Contribution Guideline

**Feature Toggle**

Syntax Extensions MUST be put behind a config flag if markdown output produced by *glossarify-md* differs from input due to evaluating custom syntax or AST node types.

**Common Mark**

- Only [CommonMark][1] or [CommonMark *Deployed Extensions*][2] SHOULD be added.
- CommonMark recommendations for handling deployed extensions SHOULD be considered, if applicable.

**Custom Node Type Naming Convention**

- Node types extending custom Markdown syntax MUST follow the pattern `ext-[domain]-[name]-[class]`
  - `domain` may be the name of a parser or company which popularized the syntax
  - `name` is the actual node type name
  - `class` might be an additional node type classification. It SHOULD use the same Classification as in the [CommonMark Deployed Extensions Catalogue][2].

  > Example: `"ext-markdown-it-toc-instruction"` for the [`[[toc]]` processing instruction][3]. *markdown-it* was used as the parser domain even though [markdown-it][5] doesn't support the instruction itself but because it popularized an extension mechansim which led to extensions such as [markdown-it-table-of-contents][6] or [markdown-it-toc-done-right][7].
- Semantic node types which do not extend Markdown input or output syntax MAY use the `ext-*` pattern.



[1]: https://spec.commonmark.org/0.29 "CommonMark v0.29"
[2]: https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions "CommonMark catalogue of Deployed Extensions"
[3]: https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions#processing-instruction "Processing Instructions acknowledged by CommonMark as Deployed Extensions"
[4]: https://npmjs.com/package/remark-parse "remark-parse"
[5]: https://npmjs.com/package/markdown-it "markdown-it"
[6]: https://npmjs.com/package/markdown-it-table-of-contents "markdown-it-table-of-contents"
[7]: https://npmjs.com/package/markdown-it-toc-done-right "markdown-it-toc-done-right"
