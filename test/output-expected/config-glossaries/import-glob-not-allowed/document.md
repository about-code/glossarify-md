# [Document](#document)

GIVEN a configuration

```json
{
  "glossaries": [{
    "file": "./glossary-*.md",
    "import": { "file": "./glossary.json" }
  }]
}
```

WITH option `"file": "glossary-*.md"` using a glob pattern
AND two files `glossary-1.md` and `glossary-2.md`
AND a file `glossary.json` existing WITH terms

*   *Glossary*
*   *Taxonomy*
*   *Thesaurus*

THEN

1.  the system MUST NOT touch `glossary-1.md` nor `glossary-2.md`
2.  AND glossarify-md MUST NOT generate a file `glossary-*.md`
3.  AND the system MUST MUST NOT linkify the terms mentioned above in *this* file
4.  AND the system MUST link terms [Term1][1] and [Term2][2]

[1]: ./glossary-1.md#term1 "MUST NOT be overwritten or modified by importing terms."

[2]: ./glossary-2.md#term2 "MUST NOT be overwritten or modified by importing terms."
