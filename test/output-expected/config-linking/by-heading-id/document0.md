# [Document 0](#document-0)

[https://github.com/about-code/glossarify-md/issues/122][1]

## [Test Case 1: Cross-Linking from nested files to this section](#section-0-1)

GIVEN

*   a document file `document0.md`
*   AND a document file `depth1/document1.md`
*   AND a document file `depth1/depth2/document2.md`

WITH document file `document0.md`

*   declaring a heading of arbitrary wording
*   AND declaring a unique pandoc-style heading id `{#section-0-1}`

THEN

*   any occurrence of `[foo](#section-0-1)` in `depth1/document1.md` MUST resolve to `../document0#section-0-1`
*   AND any occurrence of `[bar](#section-0-1)` in `depth2/document2.md` MUST resolve to `../../document0#section-0-1`.

## [Test Case 2: Cross-Linking to nested sections](#test-case-2-cross-linking-to-nested-sections)

GIVEN

*   a document file `document0.md`
*   AND a document file `depth1/document1.md`
*   AND a document file `depth1/depth2/document2.md`

WITH document file `depth1/document1.md`

*   declaring a heading of arbitrary wording
*   AND declaring a unique pandoc-style heading id `{#section-1-2}`

AND WITH document file `depth2/document2.md`

*   declaring a heading of arbitrary wording
*   AND declaring a unique pandoc-style heading id `{#section-2-2}`

THEN

*   any [link with anchor `#section-1-2`][2] in `document0.md` MUST

resolve to `./depth1/document1.md#section-1-2`

*   AND any [link with anchor `#section-2-2`][3] in `document0.md` MUST

resolve to `./depth1/depth2/document2.md#section-2-2`

[1]: https://github.com/about-code/glossarify-md/issues/122

[2]: ./depth1/document1.md#section-1-2

[3]: ./depth1/depth2/document2.md#section-2-2
