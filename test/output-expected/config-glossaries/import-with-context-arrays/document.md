# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": {
      "file": "./glossary.json",
      "context": "./custom-context.jsonld"
    }
  }]
}
```

WITH file `glossary.md` missing
AND file `glossary.json` existing as a glossary in a custom format

*   WITH its own `@context` being an array
*   AND with incomplete mappings of the custom format onto SKOS and DC
*   AND WITH terms
    *   *[Glossary][1]*
    *   *[Taxonomy][2]*
    *   *[Thesaurus][3]*
        AND file `custom-context.jsonld` existing
*   WITH its own `@context` being an array
*   AND with incomplete mappings of the custom format onto SKOS and DC

THEN

1.  the system MUST NOT fail from the missing `glossary.md`
2.  AND glossarify-md MUST merge the context arrays to gain complete mappings of the custom format onto SKOS and DC
3.  AND glossarify-md MUST generate a file `glossary.md`
    1.  AND the file MUST have a title `# Custom Import Format`
    2.  AND the file MUST have a heading `## ...` for each term
4.  AND the system MUST linkify the terms mentioned above in *this* file
5.  AND the terms must be linked to the generated file `glossary.md`

[1]: ./glossary.md#glossary "Glossaries are collections of terms and their definitions."

[2]: ./glossary.md#taxonomy "Taxonomies are classification schemes."

[3]: ./glossary.md#thesaurus "Thesauri are word nets."
