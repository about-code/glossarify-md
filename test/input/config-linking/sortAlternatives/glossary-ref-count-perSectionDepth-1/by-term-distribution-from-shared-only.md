# Test: Term Distribution From Shared only

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous terms, only, which are contributing to multiple glossary's refCount each

- 'Shared AB'
- 'Shared BC'

THEN mentions of ambiguous terms

- 'Shared AB' MUST be linked to term definitions in glossary order B, A
- 'Shared BC' MUST be linked to term definitions in glossary order B, C

due to distribution of term occurrences (including ambiguous terms in GIVEN and THEN)...

~~~
refCount
    ^
  4_|       _
  3_|      | |
  2_|   _  | |  _
  1_|  | | | | | |
  0_|  |2| |4| |2|
    +-|---|---|---|---> Glossary
      | A | B | C |
~~~

...proving that counting unambiguous term occurrences, only, is not sufficient
AND counting ambiguous term occurrences, too, makes a difference.