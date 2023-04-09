# Document B

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term 'Shared All' defined in all glossaries
AND this document mentions uniquely defined terms

- 'Only A', 'Only A', 'Only A'
- 'Only B', 'Only B'
- 'Only C'

THEN there is a distribution of uniquely defined term occurrences

*Usage of uniquely defined glossary terms in this file:*
~~~
  Unequivocal
    Terms
      ^
      |
    3_|     _
    2_|    | |           _
    1_|    | |          | |           _
    0_|    |3|          |2|          |1|
      +------------|------------|------------|--> from Glossary
        Glossary A | Glossary B | Glossary C |
~~~


AND ambiguous term 'Shared All' MUST be linked to term definitions in glossaries A, B and C
AND the order of links must be sorted according to the number of uniquely defined term uses WITH

1. link to definition in Glossary A, first
2. link to definition in Glossary B, second
3. link to definition in Glossary C, third