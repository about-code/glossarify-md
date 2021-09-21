# [Document B](#document-b)

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

*   THEN term *[🄱 Beta][1]* from Glossary B MUST be linked

*   AND term *[Heading A][2]* from Document A MUST be linked

## [Heading B](#heading-b)

Heading of Document B.

[1]: ../glossaries/glossary-b.md#beta "Term in Glossary B."

[2]: ./document-a.md#heading-a "Heading of Document A."
