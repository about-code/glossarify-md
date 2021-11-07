# [Document](#document)

GIVEN

*   a configuration

    ```json
    {
      "glossaries": [
        {
          "import": { "file": "./glossary-untyped.json" },
          "file": "./imported-untyped.md"
        },{
          "import": { "file": "./glossary-typed.json" },
          "file": "./imported-typed.md"
        }
      ]
    }
    ```

*   AND a file `glossary-untyped.json`
    *   NOT WITH a typed entity mappable onto `skos:ConceptScheme`
    *   AND NOT WITH a typed entity mappable onto `skos:Concept`

*   AND a file `glossary-typed.json`
    *   WITH a typed entity mapped onto `skos:ConceptScheme`
    *   AND typed entities mapped onto `skos:Concept`
    *   AND typed entities denoting concepts
        *   *[Glossary][1][<sup>2)</sup>][2]*
        *   *[Taxonomy][3]*
        *   *[Thesaurus][4]*

THEN the system

1.  MUST generate a file `imported-untyped.md`
    1.  AND the file MUST have a title `# Glossary`
    2.  AND the file MUST NOT have any terms
2.  AND MUST generate a file `import-typed.md`
    1.  AND the file MUST have a heading equal to the `title` attribute in `import-typed.json`
    2.  AND the file MUST contain each term mentioned above
3.  AND the system MUST linkify the terms mentioned above to `import-typed.md` *only*

[1]: ./imported-typed.md#glossary "Glossaries are collections of terms and their definitions."

[2]: ./imported-untyped.md#glossary

[3]: ./imported-typed.md#taxonomy "Taxonomies are classification schemes."

[4]: ./imported-typed.md#thesaurus "Thesauri are word nets."
