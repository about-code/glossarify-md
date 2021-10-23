# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "file": "./glossary-*.md",
    "import": { "file": "./glossary.json" }
  }]
}
~~~

WITH option `"file": "glossary-*.md"` using a glob pattern
AND two files `glossary-1.md` and `glossary-2.md`
AND a file `glossary.json` existing WITH terms
- *Glossary*
- *Taxonomy*
- *Thesaurus*

THEN

1. the system MUST NOT touch `glossary-1.md` nor `glossary-2.md`
1. AND glossarify-md MUST NOT generate a file `glossary-*.md`
1. AND the system MUST MUST NOT linkify the terms mentioned above in *this* file
1. AND the system MUST link terms Term1 and Term2
