# Glossary

## Term

GIVEN

- a term *Term*
- AND a config

  ~~~json
  {
    "glossaries": [{
      "file": "./glossary.md"
    }],
    "indexing": {
      "groupByHeadingDepth": 2
    },
    "generateFiles": {
      "indexFile": {
        "file": "./index.md",
        "title": "EXPECT Title"
      }
    }
  }
  ~~~

- AND two documents `document-1.md`, `document-2.md`
- AND term occurrences in multiple sections of each document
- AND some term occurrences in sections of a depth less or equal to `groupHeadingDepth`
- AND some term occurrences in sections deeper than `groupHeadingDepth`

THEN

- a file `index.md` MUST be generated
- AND the file MUST have a heading *Term*
- AND the file MUST group under that heading *in this order*:

  1.  *Glossary* at `depth: 1`
  2.  *Document 1* at `depth: 1`
  4.  *Section 1.1* at `depth: 2`
  5.  *Section 1.1.1* at `depth: 3` reduced to label 2
  6.  *Section 1.1.1.1* at `depth: 4` reduced to label 3
  7.  *Section 1.1.1.1.1* at `depth: 5` reduced to label 4
  8.  *Section 1.1.1.1.1.1* at `depth: 6` reduced to label 5
  9.  *Section 1.2* at `depth: 2`
  10. *Section 1.3* at `depth: 2`
  11. *Section 1.4* at `depth: 2`
  12. *Document 2* at `depth: 1`
  13. *Section 2.1* at `depth: 2`
  14. *Section 2.1.1* at `depth: 3` reduced to label 2
  15. *Section 2.1.1.1* at `depth: 4` reduced to label 3
  16. *Section 2.1.1.1.1* at `depth: 5` reduced to label 4
  17. *Section 2.1.1.1.1.1* at `depth: 6` reduced to label 5
