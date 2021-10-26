# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [
    {
      "uri": "https://my.org/vocab/#",
      "file": "./glossary*.md",
      "linkUris": true
    }
  ]
}
```

WITH a glob pattern `./glossary*.md` AND option `linkUris: true`
AND a glossary `glossary-1.md` with a term *[Foo][2]*
AND a glossary `glossary-2.md` with a term *[Bar][3]*
AND this document mentioning the terms
THEN the system MUST linkify

1.  term *[Foo][2]* using URL `https://my.org/vocab/#foo`
2.  term *[Bar][3]* using URL `https://my.org/vocab/#bar`

[1]: #document

[2]: http://my.org/vocab/#foo "Term in Glossary 1"

[3]: http://my.org/vocab/#bar "Term in Glossary 2"
