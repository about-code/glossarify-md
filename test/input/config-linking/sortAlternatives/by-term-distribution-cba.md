# Test: Term Distribution CBA

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term contributing to multiple glossary's refCount

- 'Shared All'

AND this document mentions unambiguous terms contributing to a single glossary's refCount each

- 'Only A'
- 'Only B', 'Only B'
- 'Only C', 'Only C', 'Only C'

THEN mentions of ambiguous term

- 'Shared All' MUST be linked to term definitions in glossary order C, B and A

due to distribution of term occurrences (including ambiguous terms in GIVEN and THEN)

~~~
refCount
    ^
  5_|           _
  4_|       _  | |
  3_|   _  | | | |
  2_|  | | | | | |
  1_|  | | | | | |
  0_|  |3| |4| |5|
    +-|---|---|---|--> glossary
      | A | B | C |
~~~