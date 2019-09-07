# Testing a config with multiple glossaries

WHEN there are two or more glossaries with a disjunct set of terms THEN "[Term Disjunct A(a)][1]" MUST be linked WITH glossary-disjunct-a.

WHEN there are two or more glossaries with a disjunct set of terms THEN "[Term Disjunct B(b)][2]" MUST be linked WITH glossary-disjunct-b.

WHEN there are two or more glossaries with a common set of terms THEN "[Term Common][3][ (0)][3][, (1)][4]" MUST Be linked WITH
glossary-common-a AND glossary-common-b.

[1]: glossary-disjunct-a.md#term-disjunct-a

[2]: glossary-disjunct-b.md#term-disjunct-b

[3]: glossary-common-a.md#term-common

[4]: glossary-common-b.md#term-common
