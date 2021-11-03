# Document 1

GIVEN

1.  a configuration `linking.headingIdAlgorithm: "sha256-7"`

  ~~~json
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
  ~~~

1. AND two glossaries with a term Alpha
1. AND two documents *Document 1* and *Document 2*, both mentioning term Alpha

THEN

1. in the glossary files both terms MUST have a different hash value
1. AND in document files links MUST use a SHA256 URL fragment as a link target identifier
1. AND in the generated index file
   1. there MUST be *one* entry for the term
   1. AND there MUST be *two* glossaries linked under that entry
   1. AND there MUST be *two* documents linked under that entry
