# [Testing config `indexFiles` with multiple index files](#testing-config-indexfiles-with-multiple-index-files)

GIVEN thre glossaries glossary-a, glossary-b and glossary-c WITH a set of terms

*   [GlossaryA\_Term1][1],
*   [GlossaryA\_Term2][2],
*   [GlossaryB\_Term1][3],
*   [GlossaryB\_Term2][4],
*   [GlossaryC\_Term1][5],
*   [GlossaryC\_Term2][6],
*   [GlossaryABC\_Term3][7][<sup>2)</sup>][8][<sup> 3)</sup>][9] (all three)

AND a configuration

```json
{
  "generateFiles": {
    "indexFiles": [
      {
        "title": "Index A", "file": "./index-a.md", "glossary": "./glossary-a.md"
      },
      {
        "title": "Index B", "file": "./sub1-index/index-b.md", "glossary": "./sub1/glossary-b.md"
      },
      {
        "title": "Index C", "file": "./sub1-index/sub2-index/index-c.md", "glossary": "./sub1/sub2/glossary-c.md"
      }
    ]
  },
  "glossaries": [
    {
      "file": "./**/glossary-*.md"
    }
  ]
}
```

THEN the system MUST generate three files

*   index-a.md
    *   WITH terms [GlossaryA\_Term1][1], [GlossaryA\_Term2][2], [GlossaryABC\_Term3][7][<sup>2)</sup>][8][<sup> 3)</sup>][9], only
*   sub1-index/index-b.md
    *   WITH terms [GlossaryB\_Term1][3], [GlossaryB\_Term2][4], [GlossaryABC\_Term3][7][<sup>2)</sup>][8][<sup> 3)</sup>][9], only
*   sub1-index/sub2-index/index-c.md
    *   WITH terms [GlossaryC\_Term1][5], [GlossaryC\_Term2][6], [GlossaryABC\_Term3][7][<sup>2)</sup>][8][<sup> 3)</sup>][9], only

AND

*   links from within indexes at each depth MUST resolve to the document's section of occurrence.

[1]: ./glossary-a.md#glossarya_term1

[2]: ./glossary-a.md#glossarya_term2

[3]: ./sub1/glossary-b.md#glossaryb_term1

[4]: ./sub1/glossary-b.md#glossaryb_term2

[5]: ./sub1/sub2/glossary-c.md#glossaryc_term1

[6]: ./sub1/sub2/glossary-c.md#glossaryc_term2

[7]: ./glossary-a.md#glossaryabc_term3

[8]: ./sub1/glossary-b.md#glossaryabc_term3

[9]: ./sub1/sub2/glossary-c.md#glossaryabc_term3
