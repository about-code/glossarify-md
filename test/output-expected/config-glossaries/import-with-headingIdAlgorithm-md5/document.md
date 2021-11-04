# [Document](#md5-0a9a7c4)

GIVEN a configuration

```json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": { "file": "./glossary.json" }
  }],
  "linking": {
    "headingIdAlgorithm": "md5-7"
  },
}
```

WITH file `glossary.md` missing
AND file `glossary.json` existing WITH terms

*   *[Glossary][1]*
*   *[Taxonomy][2]*
*   *[Thesaurus][3]*

THEN

1.  the system MUST NOT fail from the missing `glossary.md`
2.  AND glossarify-md MUST generate a file `glossary.md`
    1.  AND the file MUST have a title `# Glossary`
    2.  AND the file MUST have a heading `## ...` for each term
3.  AND the system MUST linkify the terms mentioned above in *this* file
4.  AND the terms MUST be linked to the generated file `glossary.md`
5.  AND terms in `terms.json` MUST have their imported URI in `headingIdPlain`

[1]: ./glossary.md#md5-c950bf0 "Glossaries are collections of terms and their definitions."

[2]: ./glossary.md#md5-ee9d483 "Taxonomies are classification schemes."

[3]: ./glossary.md#md5-a03ea0a "Thesauri are word nets."
