# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [
    {
      "uri": "https://my.org/vocab/#",
      "file": "./glossary.md",
      "linkUris": true
    }
  ]
}
```

WITH option `linkUris: true`
AND a glossary with a term *[Foo][1]*
AND this document mentioning the term
THEN the system MUST linkify the term
AND the link URL must be the URI `https://my.org/vocab/#foo`

[1]: http://my.org/vocab/#foo "To be linked by its URI."
