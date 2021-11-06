# Document

GIVEN

- a configuration

  ~~~json
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
  ~~~

- AND a file `glossary-untyped.json`
  - NOT WITH a typed entity mappable onto `skos:ConceptScheme`
  - AND NOT WITH a typed entity mappable onto `skos:Concept`
- AND a file `glossary-typed.json`
  - WITH a typed entity mapped onto `skos:ConceptScheme`
  - AND typed entities mapped onto `skos:Concept`
  - AND typed entities denoting concepts
    - *Glossary*
    - *Taxonomy*
    - *Thesaurus*

THEN the system

1. MUST generate a file `imported-untyped.md`
   1. AND the file MUST have a title `# Glossary`
   1. AND the file MUST NOT have any terms
1. AND MUST generate a file `import-typed.md`
   1. AND the file MUST have a heading equal to the `title` attribute in `import-typed.json`
   1. AND the file MUST contain each term mentioned above
1. AND the system MUST linkify the terms mentioned above to `import-typed.md` *only*
