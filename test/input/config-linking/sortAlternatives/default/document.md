GIVEN

- a configuration...
  ~~~json
  {
    "glossaries": [{
      "file": "./glossary-*.md"
    }]
  }
  ~~~
- AND a term <em>Shared All</em> ambiguously defined in all glossaries
- AND a distinct term per glossary

THEN...

# Title (Depth 1)

...

- mentioning ambiguous term Shared All at section depth 1 MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

## Chapter 1 (Depth 2)

...

- mentioning ambiguous term Shared All at section depth 2
- mentioning distinct term Only A

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

### Section 1.1 (Depth 3)
...

- mentioning ambiguous term Shared All at section depth 2
- mentioning distinct term Only B

MUST generate links to glossary definitions in order ABC which is the order by glossary fi

### Section 1.2 (Depth 3)

...

- mentioning ambiguous term Shared All at section depth 2
- mentioning distinct term Only C

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

## Chapter 2 (Depth 2)

...

- mentioning ambiguous term Shared All at section depth 2
- mentioning distinct term Only B

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

### Section 2.1 (Depth 3)

...

- mentioning ambiguous term Shared All at section depth 2
- mentioning distinct term Only B

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

### Section 2.2 (Depth 3)

...

- mentioning ambiguous term Shared All at section depth 2
- mentioning distinct term Only C

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.
