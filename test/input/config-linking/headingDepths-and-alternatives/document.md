# Document

## Test Case 1: Depth 1 before Depth 2

The heading at depth 2 to be linkified *and* indexed is processed *after* the
heading at depth 1 to be indexed, only. In a prior (broken) implementation a term
occurrence of *Vocabulary* was never linkified due to the heading at depth 1 being
considered *the term* that was to be excluded from linking and the heading at
depth 2 was considered an *alternative definition* of a term that should not be
linked.

GIVEN

1. a configuration
    ~~~json
    {
        "glossaries": [
            { "file": "./glossary-tc1-1.md" },
            { "file": "./glossary-tc1-2.md" },
            { "file": "./glossary-tc2-1.md" },
            { "file": "./glossary-tc2-2.md" }
        ],
        "indexing": {
            "headingDepths": [1,2,3,4,5,6] // configured but currently also default
        },
        "linking": {
            "headingDepths": [2,4] // test-case
        }
    }
    ~~~
2. AND a glossary `glossary-tc1-1.md` WITH
   - a term heading *Vocabulary* at depth 2
   - AND the heading to be indexed
   - AND the heading to be considered for linking
2. AND a glossary `glossary-tc1-2.md`
   - WITH a heading *Vocabulary* at depth 1
   - AND the heading to be indexed
   - AND the heading to NOT be considered for linking
2. AND this occurrence of term *Vocabulary*

THEN

1. term *Vocabulary* MUST be linked to glossary `glossary-2.md`
1. AND term *Vocabulary* MUST NOT be linked to glossary `glossary-1.md`
1. AND the heading at depth 1 in `glossary-1.md` MUST NOT be considered an alternative definition


## Test Case 2: Depth 2 before Depth 1

The heading at depth 2 to be linkified *and* indexed is processed *before* the
heading at depth 1 to be indexed, only. In a prior (broken) implementation a
term occurrence of *Taxonomy* was linkified due to the heading at depth 2 but
the heading at depth 1 was indexed and handled like an *alternative definition*
and therefore was linked, too (superscript link).

GIVEN

1. a configuration
    ~~~json
    {
        "glossaries": [
            { "file": "./glossary-tc1-1.md" },
            { "file": "./glossary-tc1-2.md" },
            { "file": "./glossary-tc2-1.md" },
            { "file": "./glossary-tc2-2.md" }
        ],
        "indexing": {
            "headingDepths": [1,2,3,4,5,6] // configured but currently also default
        },
        "linking": {
            "headingDepths": [2,4] // test-case
        }
    }
    ~~~
2. AND a glossary `glossary-tc2-1.md` WITH
   - a term heading *Taxonomy* at depth 2
   - AND the heading to be indexed
   - AND the heading to be considered for linking
2. AND a glossary `glossary-tc2-2.md`
   - WITH a heading *Taxonomy* at depth 1
   - AND the heading to be indexed
   - AND the heading to NOT be considered for linking
2. AND this occurrence of term *Taxonomy*

THEN

1. term *Taxonomy* MUST be linked to glossary `glossary-2.md`
1. AND term *Taxonomy* MUST NOT be linked to glossary `glossary-1.md`
1. AND the heading at depth 1 in `glossary-1.md` MUST NOT be considered an alternative definition
