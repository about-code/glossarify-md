# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [{
    "uri": "https://ignore.org/vocab/#",
    "file": "glossary.md",
    "import": {
      "file": "./glossary.nq"
    }
  }],
}
```

WITH file `glossary.md` missing
AND file `glossary.nq` existing WITH terms

*   *[Simple][1]*
*   *[Aliased][2]*
*   *[Custom-URI][3]*

AND a vocabulary `uri` which is different from the term URIs imported
THEN

1.  the system MUST NOT fail from the missing `glossary.md`
2.  AND glossarify-md MUST generate a file `glossary.md`
    1.  AND the file MUST have a title `# Glossary`
    2.  AND the file MUST have a heading `## ...` for each term
3.  AND the system MUST linkify the terms mentioned above in *this* file
4.  AND the terms must be linked to the generated file `glossary.md`
5.  AND terms must have their original URI from the imported file

[1]: ./glossary.md#simple "GIVEN a simple term with two sentences."

[2]: ./glossary.md#aliased "GIVEN a term with aliases
THEN this term MUST be exported with all its aliases as SKOS altLabel."

[3]: ./glossary.md#custom-uri "GIVEN a term with a uri term attribute
THEN this term MUST be exported using uri https://other.org/vocab/#custom-uri."
