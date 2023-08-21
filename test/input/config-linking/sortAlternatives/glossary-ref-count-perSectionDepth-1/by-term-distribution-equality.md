# Test: Term Distribution Equal

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term contributing to multiple glossary's refCount

- 'Shared All'

AND this document mentions unambiguous terms contributing to a single glossary's refCount each

- 'Only A'
- 'Only B'
- 'Only C'

THEN mentions of ambiguous term

- 'Shared All' MUST be linked to term definitions in glossary order A, B and C

due to distribution of term occurrences (including ambiguous terms in GIVEN and THEN)

~~~
refCount
    ^
  3_|   _   _   _
  2_|  | | | | | |
  1_|  | | | | | |
  0_|  |3| |3| |3|
    +-|---|---|---|--> glossary
      | A | B | C |
~~~
