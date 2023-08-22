GIVEN

- a configuration...
  ~~~json
  {
    "glossaries": [{
      "file": "./glossary-*.md"
    }],
    "linking": {
      "sortAlternatives":{
        "by": "glossary-ref-count",
        "perSectionDepth": 2
      }
    }
  }
  ~~~
- AND a term <em>Shared All</em> defined in all glossaries
- AND a distinct term per glossary
- **AND no section headings**
- AND term occurrences
  - Shared All
  - Only A
  - Only B, Shared AB, Shared BC

THEN term occurrence <em>Shared All</em> MUST be linked to glossary definitions in order BAC which is the order derived from a glossary reference count distribution

~~~
refCount
    ^
  4_|   _
  3_|  | |  _
  2_|  | | | |  _
  1_|  | | | | | |
  0_|  |4| |3| |2|
    +-|---|---|---|---> Glossary
      | B | A | C |
~~~


