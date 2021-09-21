# Document A

- GIVEN a configuration

  ~~~json
  "glossaries": [
    { "file": "./documents/**/document-*.md" },
    { "file": "./glossaries/glossary-a.md", "termHint": "🄰 ${term}" },
    { "file": "./glossaries/glossary-b.md", "termHint": "🄱 ${term}" }
  ]
  ~~~

- AND a set x of glossaries found by glob pattern
- AND a set y of glossaries listed explicitly
- AND both sets x and y being disjunct
- THEN term *Alpha* from Glossary A MUST be linked
- AND term *Heading B* from Document B MUST be linked

## Heading A

Heading of Document A.
