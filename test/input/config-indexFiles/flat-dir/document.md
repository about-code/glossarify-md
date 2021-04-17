# Testing config `indexFiles` with multiple index files

GIVEN two glossaries glossary-a and glossary-b WITH a set of terms
  - GlossaryA_Term1,
  - GlossaryA_Term2,
  - GlossaryB_Term1,
  - GlossaryB_Term2,
  - GlossaryAB_Term3 (both)

AND a configuration

~~~json
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
~~~

THEN the system MUST generate two files

- index-a.md
  - WITH terms GlossaryA_Term1, GlossaryA_Term2, GlossaryAB_Term3, only
- index-b.md
  - WITH terms GlossaryB_Term1, GlossaryB_Term2, GlossaryAB_Term3, only
