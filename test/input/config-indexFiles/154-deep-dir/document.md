# Testing config `indexFiles` with multiple index files

GIVEN thre glossaries glossary-a, glossary-b and glossary-c WITH a set of terms
  - GlossaryA_Term1,
  - GlossaryA_Term2,
  - GlossaryB_Term1,
  - GlossaryB_Term2,
  - GlossaryC_Term1,
  - GlossaryC_Term2,
  - GlossaryABC_Term3 (all three)

AND a configuration

~~~json
{
  "generateFiles": {
    "indexFiles": [
      { "title": "Index A", "file": "./index-a.md", "glossary": "./glossary-a.md" },
      { "title": "Index B", "file": "./index-b.md", "glossary": "./sub1/glossary-b.md" },
      { "title": "Index C", "file": "./index-c.md", "glossary": "./sub1/sub2/glossary-c.md" }
    ]
  },
  "glossaries": [
    { "file": "./**/glossary-*.md" }
  ]
}
~~~

THEN the system MUST generate three files

- index-a.md
  - WITH terms GlossaryA_Term1, GlossaryA_Term2, GlossaryABC_Term3, only
- index-b.md
  - WITH terms GlossaryB_Term1, GlossaryB_Term2, GlossaryABC_Term3, only
- index-c.md
  - WITH terms GlossaryC_Term1, GlossaryC_Term2, GlossaryABC_Term3, only
