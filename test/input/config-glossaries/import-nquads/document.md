# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "uri": "https://ignore.org/vocab/#",
    "file": "glossary.md",
    "import": {
      "file": "./glossary.nq"
    }
  }],
}
~~~

WITH file `glossary.md` missing
AND file `glossary.nq` existing WITH terms
- *Simple*
- *Aliased*
- *Custom-URI*

AND a vocabulary `uri` which is different from the term URIs imported
THEN

1. the system MUST NOT fail from the missing `glossary.md`
1. AND glossarify-md MUST generate a file `glossary.md`
   1. AND the file MUST have a title `# Glossary`
   1. AND the file MUST have a heading `## ...` for each term
1. AND the system MUST linkify the terms mentioned above in *this* file
1. AND the terms must be linked to the generated file `glossary.md`
1. AND terms must have their original URI from the imported file
