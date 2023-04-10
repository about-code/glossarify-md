# Document B

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous terms

- 'Shared All'
- 'Shared AB'
- 'Shared AB', 'Shared BC'
- 'Shared BC'

AND this document mentions uniquely defined terms

- 'Only A', 'Only A'
- 'Only B'
- 'Only C', 'Only C', 'Only C'

THEN there is a distribution of uniquely defined term occurrences

*Usage of uniquely defined glossary terms in this file:*
~~~
  Unequivocal
    Terms
      ^
      |
    3_|                               _
    2_|     _                        | |
    1_|    | |           _           | |
    0_|    |2|          |1|          |3|
      +------------|------------|------------|--> from Glossary
        Glossary A | Glossary B | Glossary C |
~~~


AND ambiguous term 'Shared All' MUST be linked to term definitions in order C, A, B
AND ambiguous term 'Shared AB'  MUST be linked to term definitions in order A, B
AND ambiguous term 'Shared BC'  MUST be linked to term definitions in order C, B
