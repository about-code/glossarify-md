GIVEN

*   a configuration...
    ```json
    {
      "glossaries": [{
        "file": "./glossary-*.md"
      }]
    }
    ```
*   AND a term <em>Shared All</em> ambiguously defined in all glossaries
*   AND a distinct term per glossary

THEN...

# [Title (Depth 1)](#title-depth-1)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 1 MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

## [Chapter 1 (Depth 2)](#chapter-1-depth-2)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 2
*   mentioning distinct term [Only A][4]

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

### [Section 1.1 (Depth 3)](#section-11-depth-3)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 2
*   mentioning distinct term [Only B][5]

MUST generate links to glossary definitions in order ABC which is the order by glossary fi

### [Section 1.2 (Depth 3)](#section-12-depth-3)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 2
*   mentioning distinct term [Only C][6]

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

## [Chapter 2 (Depth 2)](#chapter-2-depth-2)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 2
*   mentioning distinct term [Only B][5]

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

### [Section 2.1 (Depth 3)](#section-21-depth-3)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 2
*   mentioning distinct term [Only B][5]

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

### [Section 2.2 (Depth 3)](#section-22-depth-3)

...

*   mentioning ambiguous term [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3] at section depth 2
*   mentioning distinct term [Only C][6]

MUST generate links to glossary definitions in order ABC which is the order by glossary filename.

[1]: ./glossary-a.md#shared-all "Glossary A"

[2]: ./glossary-b.md#shared-all "Glossary B"

[3]: ./glossary-c.md#shared-all "Glossary C"

[4]: ./glossary-a.md#only-a "defined in glossary A, only."

[5]: ./glossary-b.md#only-b "defined in glossary B, only."

[6]: ./glossary-c.md#only-c "defined in Glossary C, only."
