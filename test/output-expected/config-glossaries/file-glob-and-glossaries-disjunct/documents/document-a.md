# [Document A](#document-a)

*   GIVEN a configuration

    ```json
    "glossaries": [
      { "file": "./documents/**/document-*.md" },
      { "file": "./glossaries/glossary-a.md", "termHint": "🄰 ${term}" },
      { "file": "./glossaries/glossary-b.md", "termHint": "🄱 ${term}" }
    ]
    ```

*   AND a set x of glossaries found by glob pattern

*   AND a set y of glossaries listed explicitly

*   AND both sets x and y being disjunct

*   THEN term *[🄰 Alpha][1]* from Glossary A MUST be linked

*   AND term *[Heading B][2]* from Document B MUST be linked

## [Heading A](#heading-a)

Heading of Document A.

[1]: ../glossaries/glossary-a.md#alpha "Term in Glossary A."

[2]: ./document-b.md#heading-b "Heading of Document B."
