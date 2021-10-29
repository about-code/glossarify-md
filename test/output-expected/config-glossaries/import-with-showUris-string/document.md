# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": { "file": "./glossary.json" },
    "showUris": "- ${uri}"
  }]
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
    3.  AND the file MUST have each term's URI rendered as a markdown list below the term's definition
3.  AND the system MUST linkify the terms mentioned above in *this* file
4.  AND the terms must be linked to the generated file `glossary.md`

[1]: ./glossary.md#glossary "Glossaries are collections of terms and their definitions."

[2]: ./glossary.md#taxonomy "Taxonomies are classification schemes."

[3]: ./glossary.md#thesaurus "Thesauri are word nets."
