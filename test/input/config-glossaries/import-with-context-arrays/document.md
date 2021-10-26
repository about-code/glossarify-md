# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": {
      "file": "./glossary.json",
      "context": "./custom-context.jsonld"
    }
  }]
}
~~~

WITH file `glossary.md` missing
AND file `glossary.json` existing as a glossary in a custom format
  - WITH its own `@context` being an array
  - AND with incomplete mappings of the custom format onto SKOS and DC
  - AND WITH terms
    - *Glossary*
    - *Taxonomy*
    - *Thesaurus*
AND file `custom-context.jsonld` existing
  - WITH its own `@context` being an array
  - AND with incomplete mappings of the custom format onto SKOS and DC

THEN

1. the system MUST NOT fail from the missing `glossary.md`
1. AND glossarify-md MUST merge the context arrays to gain complete mappings of the custom format onto SKOS and DC
1. AND glossarify-md MUST generate a file `glossary.md`
   1. AND the file MUST have a title `# Custom Import Format`
   1. AND the file MUST have a heading `## ...` for each term
1. AND the system MUST linkify the terms mentioned above in *this* file
1. AND the terms must be linked to the generated file `glossary.md`
