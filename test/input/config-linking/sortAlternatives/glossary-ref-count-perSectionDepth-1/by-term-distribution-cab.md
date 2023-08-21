# Test: Term Distribution CAB

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous terms contributing to multiple glossary's refCount

- 'Shared All'
- 'Shared AB'
- 'Shared BC'

AND this document mentions unambiguous terms contributing to a single glossary's refCount

- 'Only A', 'Only A', 'Only A'
- 'Only C', 'Only C', 'Only C', 'Only C'

THEN mentions of ambiguous terms

- 'Shared All' MUST be linked to term definitions in glossary order C, A, B
- 'Shared AB'  MUST be linked to term definitions in glossary order A, B
- 'Shared BC'  MUST be linked to term definitions in glossary order C, B

due to distribution of term occurrences (including counting ambiguous occurrences in GIVEN and THEN)

~~~
refCount
    ^
    |          _
  8_|  _      | |
  7_| | |  _  | |
  6_| | | | | | |
  5_| | | | | | |
  4_| | | | | | |
  3_| | | | | | |
  2_| | | | | | |
  1_| | | | | | |
  0_| |7| |6| |8|
    +|---|---|---|--> glossary
     | A | B | C |
~~~
