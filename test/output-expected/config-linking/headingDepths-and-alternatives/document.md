# [Document](#document)

## [Test Case 1: Depth 1 before Depth 2](#test-case-1-depth-1-before-depth-2)

The heading at depth 2 to be linkified *and* indexed is processed *after* the
heading at depth 1 to be indexed, only. In a prior (broken) implementation a term
occurrence of *[Vocabulary][1]* was never linkified due to the heading at depth 1 being
considered *the term* that was to be excluded from linking and the heading at
depth 2 was considered an *alternative definition* of a term that should not be
linked.

GIVEN

1.  a configuration
    ```json
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
    ```
2.  AND a glossary `glossary-tc1-1.md` WITH
    *   a term heading *[Vocabulary][1]* at depth 2
    *   AND the heading to be indexed
    *   AND the heading to be considered for linking
3.  AND a glossary `glossary-tc1-2.md`
    *   WITH a heading *[Vocabulary][1]* at depth 1
    *   AND the heading to be indexed
    *   AND the heading to NOT be considered for linking
4.  AND this occurrence of term *[Vocabulary][1]*

THEN

1.  term *[Vocabulary][1]* MUST be linked to glossary `glossary-2.md`
2.  AND term *[Vocabulary][1]* MUST NOT be linked to glossary `glossary-1.md`
3.  AND the heading at depth 1 in `glossary-1.md` MUST NOT be considered an alternative definition

## [Test Case 2: Depth 2 before Depth 1](#test-case-2-depth-2-before-depth-1)

The heading at depth 2 to be linkified *and* indexed is processed *before* the
heading at depth 1 to be indexed, only. In a prior (broken) implementation a
term occurrence of *[Taxonomy][2]* was linkified due to the heading at depth 2 but
the heading at depth 1 was indexed and handled like an *alternative definition*
and therefore was linked, too (superscript link).

GIVEN

1.  a configuration
    ```json
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
    ```
2.  AND a glossary `glossary-tc2-1.md` WITH
    *   a term heading *[Taxonomy][2]* at depth 2
    *   AND the heading to be indexed
    *   AND the heading to be considered for linking
3.  AND a glossary `glossary-tc2-2.md`
    *   WITH a heading *[Taxonomy][2]* at depth 1
    *   AND the heading to be indexed
    *   AND the heading to NOT be considered for linking
4.  AND this occurrence of term *[Taxonomy][2]*

THEN

1.  term *[Taxonomy][2]* MUST be linked to glossary `glossary-2.md`
2.  AND term *[Taxonomy][2]* MUST NOT be linked to glossary `glossary-1.md`
3.  AND the heading at depth 1 in `glossary-1.md` MUST NOT be considered an alternative definition

[1]: ./glossary-tc1-2.md#vocabulary "GIVEN a term heading at depth 2
AND an identical term at depth 1 in another glossary
AND this glossary being processed after the other glossary --- Test Case: depth 1 before depth 2 ---"

[2]: ./glossary-tc2-1.md#taxonomy "GIVEN a term heading at depth 2
AND an identical term at depth 1 in another glossary
AND this glossary being processed before the other glossary --- Test Case: depth 2 before depth 1 ---"
