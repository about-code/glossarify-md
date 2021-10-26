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
AND a glossary `glossary-1.md` with a term *Foo*
AND a glossary `glossary-2.md` with a term *Bar*
AND this document mentioning the terms
THEN the system MUST linkify

1.  term *Foo* using URL `https://my.org/vocab/#foo`
2.  term *Bar* using URL `https://my.org/vocab/#bar`
