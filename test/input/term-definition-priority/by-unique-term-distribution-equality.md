# Document A

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term 'Shared All' defined in all glossaries
AND this document mentions uniquely defined terms 'Only A', 'Only B', 'Only C' equally often
THEN there is an equal distribution of uniquely defined term occurrences

*Usage of uniquely defined glossary terms in this file:*
~~~
  Unequivocal
    Terms
      ^
    2_|
    1_|     _            _            _
    0_|    |1|          |1|          |1|
      +------------|------------|------------|--> from Glossary
        Glossary A | Glossary B | Glossary C |
~~~


AND term 'Shared All' MUST be linked to all term definitions in glossaries A, B and C
AND the order of links must be alphabetically, descending WITH

1. link to definition in Glossary A, first
2. link to definition in Glossary B, second
3. link to definition in Glossary C, third