# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": {
      "file": "https://raw.githubusercontent.com/about-code/glossarify-md/master/test/input/config-glossaries/import-remote-data/glossary.json"
    }
  }]
}
```

WITH file `glossary.md` missing
AND *remote* file [https://raw.githubusercontent.com/about-code/glossarify-md/master/test/input/config-glossaries/import-remote-data/glossary.json][1] existing WITH terms

*   *[Glossary][2]*
*   *[Taxonomy][3]*
*   *[Thesaurus][4]*

THEN

1.  the system MUST NOT fail from the missing `glossary.md`
2.  AND glossarify-md MUST generate a file `glossary.md`
    1.  AND the file MUST have a title `# Glossary`
    2.  AND the file MUST have a heading `## ...` for each term
3.  AND the system MUST linkify the terms mentioned above in *this* file
4.  AND the terms must be linked to the generated file `glossary.md`

[1]: https://raw.githubusercontent.com/about-code/glossarify-md/master/test/input/config-glossaries/import-remote-data/glossary.json

[2]: ./glossary.md#glossary "Glossaries are collections of terms and their definitions."

[3]: ./glossary.md#taxonomy "Taxonomies are classification schemes."

[4]: ./glossary.md#thesaurus "Thesauri are word nets."
