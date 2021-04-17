# [Testing config `indexFiles` with multiple index files](#testing-config-indexfiles-with-multiple-index-files)

GIVEN two glossaries glossary-a and glossary-b WITH a set of terms

*   [GlossaryA_Term1][1],
*   [GlossaryA_Term2][2],
*   [GlossaryB_Term1][3],
*   [GlossaryB_Term2][4],
*   [GlossaryAB_Term3][5][<sup>2)</sup>][6] (both)

AND a configuration

```json
{
  "generateFiles": {
    "indexFiles": [
      { "title": "Index A", "file": "./index-a.md", "glossary": "./glossary-a.md" },
      { "title": "Index B", "file": "./index-b.md", "glossary": "./glossary-b.md" }
    ]
  },
  "glossaries": [
    { "file": "./glossary-*.md" }
  ],
}
```

THEN the system MUST generate two files

*   index-a.md
    *   WITH terms [GlossaryA_Term1][1], [GlossaryA_Term2][2], [GlossaryAB_Term3][5][<sup>2)</sup>][6], only
*   index-b.md
    *   WITH terms [GlossaryB_Term1][3], [GlossaryB_Term2][4], [GlossaryAB_Term3][5][<sup>2)</sup>][6], only

[1]: ./glossary-a.md#glossarya_term1

[2]: ./glossary-a.md#glossarya_term2

[3]: ./glossary-b.md#glossaryb_term1

[4]: ./glossary-b.md#glossaryb_term2

[5]: ./glossary-a.md#glossaryab_term3

[6]: ./glossary-b.md#glossaryab_term3
