# [Document 2](#sha256-fede59a)

GIVEN

1.  a configuration `linking.headingIdAlgorithm: "sha256-7"`

```json
{
  "linking": {
    "paths": "relative",
    "headingIdAlgorithm": "sha256-7"
  },
  "glossaries": [{
    "uri": "http://my.org/vocab/#",
    "file": "./**/*.md"
  }],
  "generateFiles": {
    "indexFile": {
        "title": "Index",
        "file": "./sha256-index.md"
    }
  }
}
```

1.  AND two glossaries with a term [Alpha][1][<sup>2)</sup>][2]
2.  AND two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]

THEN

1.  in the glossary files both terms MUST have a different hash value
2.  AND in document files links MUST use a SHA256 URL fragment as a link target identifier
3.  AND in the generated index file
    1.  there MUST be *one* entry for the term
    2.  AND there MUST be *two* glossaries linked under that entry
    3.  AND there MUST be *two* documents linked under that entry

[1]: ./glossary-1.md#sha256-7e16917 "First definition."

[2]: ./glossary-2.md#sha256-04b1d48 "Second definition."
