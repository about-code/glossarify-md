# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "file": "glossary.md",
    "import": {
      "file": "https://raw.githubusercontent.com/about-code/glossarify-md/master/test/input/config-glossaries/import-remote-data/glossary.json"
    }
  }]
}
~~~

WITH file `glossary.md` missing
AND *remote* file https://raw.githubusercontent.com/about-code/glossarify-md/master/test/input/config-glossaries/import-remote-data/glossary.json existing WITH terms
- *Glossary*
- *Taxonomy*
- *Thesaurus*

THEN

1. the system MUST NOT fail from the missing `glossary.md`
1. AND glossarify-md MUST generate a file `glossary.md`
   1. AND the file MUST have a title `# Glossary`
   1. AND the file MUST have a heading `## ...` for each term
1. AND the system MUST linkify the terms mentioned above in *this* file
1. AND the terms must be linked to the generated file `glossary.md`
