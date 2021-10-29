# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": { "file": "./glossary.json" },
    "showUris": true
  }]
}
~~~

WITH file `glossary.md` missing
AND file `glossary.json` existing WITH terms
- *Glossary*
- *Taxonomy*
- *Thesaurus*

THEN

1. the system MUST NOT fail from the missing `glossary.md`
1. AND glossarify-md MUST generate a file `glossary.md`
   1. AND the file MUST have a title `# Glossary`
   1. AND the file MUST have a heading `## ...` for each term
   1. AND the file MUST have each term's URI rendered below the term's definition
1. AND the system MUST linkify the terms mentioned above in *this* file
1. AND the terms must be linked to the generated file `glossary.md`
