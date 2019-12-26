# [Document](#document)

## [Disjunct set of terms](#disjunct-set-of-terms)

GIVEN terms '[Only in Glossary A][1]' and '[Only in Glossary B][2]'
AND the terms are defined in different glossaries
THEN the index MUST contain terms from both glossaries
AND the index MUST contain links to the correct glossary.

## [Shared set of terms](#shared-set-of-terms)

GIVEN term '[In Glossary A and B][3][<sup>1)</sup>][3][<sup> 2)</sup>][4]'
AND the term is defined in both glossaries
THEN the index MUST contain the term only once AND link to both glossaries

[1]: ./glossary-a.md#only-in-glossary-a

[2]: ./glossary-b.md#only-in-glossary-b

[3]: ./glossary-a.md#in-glossary-a-and-b

[4]: ./glossary-b.md#in-glossary-a-and-b
