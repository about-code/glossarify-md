# [Test](#test)

See [https://github.com/about-code/glossarify-md/issues/242][1]

## [Test Case 1: Term-Based Auto-Linking](#test-case-1-term-based-auto-linking)

GIVEN a term *Test*
THEN the system MUST linkify *Test*
AND the link MUST have the term's *short description* as a link title.

## [Test Case 2: Identifier-Based Cross-Linking](#test-case-2-identifier-based-cross-linking)

GIVEN a [specific link][2] with a term's custom id
AND the Markdown author DOES NOT provide a link title on its own
THEN the system SHOULD add the term's *short description* as a link title.

## [Test Case 3: Identifier-Based Cross-Linking with custom link title](#test-case-3-identifier-based-cross-linking-with-custom-link-title)

GIVEN a [specific link][3] with a term's custom id
AND the Markdown author DOES provide a custom link title on its own
THEN the system SHOULD keep "Custom Link Title" as the link title.

[1]: https://github.com/about-code/glossarify-md/issues/242

[2]: ./glossary.md#test-id "A specific link test term to test exact links to glossary definitions."

[3]: ./glossary.md#test-id "Custom Link Title"
