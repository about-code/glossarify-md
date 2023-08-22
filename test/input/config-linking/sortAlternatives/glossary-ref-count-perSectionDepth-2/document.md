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
- AND a term <em>Shared All</em> ambiguously defined in all glossaries
- AND a distinct term per glossary
- AND distinct terms being mentioned add to the popularity of the glossary which defines them
- AND a section structure
  - Title at depth 1 mentioning <em>Shared All</em>, only
    - Chapter 1 at depth 2 mentioning <em>Only A</em> from glossary A
      - Section 1.1 at depth 3 mentioning <em>Only B</em> from glossary B
      - Section 1.2 at depth 3 mentioning <em>Only C</em> from glossary C
    - Chapter 2 at depth 2 mentioning <em>Only B</em> from glossary B
      - Section 2.1 at depth 2 mentioning <em>Only B</em> from glossary B
      - Section 2.2 at depth 2 mentioning <em>Only C</em> from glossary C

THEN


- the reference count distribution for chapter 1 at section depth 2 including all its subsections is

  ~~~
  refCount
      ^
    2_|
    1_|   _   _   _
    0_|  |1| |1| |1|
      +-|---|---|---|---> Glossary
        | A | B | C |
  ~~~
- AND the reference count distribution for chapter 2 at section depth 2 including all its subsections is

  ~~~
  refCount
      ^
    2_|       _
    1_|      | |  _
    0_|   _  |2| |1|
      +-|---|---|---|---> Glossary
        | A | B | C |
  ~~~
- AND the total reference count distribution for the title section at section depth 1 is the aggregation of distributions of its subsections at depths 2

  ~~~
  refCount
      ^
    3_|       _
    2_|      | |  _
    1_|   _  | | | |
    0_|  |1| |3| |2|
      +-|---|---|---|---> Glossary
        | A | B | C |
  ~~~
- AND ...

# Title (Depth 1)

...

- AND mentioning ambiguous term Shared All at section depth 1 MUST generate links to glossary definitions in order BCA which is the descending order of reference counts 3,2,1

## Chapter 1 (Depth 2)

...

- AND mentioning ambiguous term Shared All at section depth 2
- AND mentioning distinct term Only A

MUST generate links to glossary definitions in order ABC which is the undecidable order of reference counts 1,1,1 falling back to sorting by glossary file name

### Section 1.1 (Depth 3)
...

- AND mentioning ambiguous term Shared All at section depth 3
- AND mentioning distinct term Only B

MUST generate links to glossary definitions in order ABC which is the order for the parent section at section depth 2 being applied to this subsection at depth 3, because of counting glossary references only `perSectionDepth: 2`

### Section 1.2 (Depth 3)

...

- AND mentioning ambiguous term Shared All at section depth 3
- AND mentioning distinct term Only C

MUST generate links to glossary definitions in order ABC which is the order for the parent section at section depth 2 being applied to this subsection at depth 3, because of counting glossary references only `perSectionDepth: 2`

## Chapter 2 (Depth 2)

...

- AND mentioning ambiguous term Shared All at section depth 2
- AND mentioning distinct term Only B

MUST generate links to glossary definitions in order BCA

### Section 2.1 (Depth 3)

...

- AND mentioning ambiguous term Shared All at section depth 3
- AND mentioning distinct term Only B

MUST generate links to glossary definitions in order BCA which is the order for the parent section at section depth 2 being applied to this subsection at depth 3, because of counting glossary references only `perSectionDepth: 2`

### Section 2.2 (Depth 3)

...

- AND mentioning ambiguous term Shared All at section depth 3
- AND mentioning distinct term Only C

MUST generate links to glossary definitions in order BCA which is the order for the parent section at section depth 2 being applied to this subsection at depth 3, because of counting glossary references only `perSectionDepth: 2`
