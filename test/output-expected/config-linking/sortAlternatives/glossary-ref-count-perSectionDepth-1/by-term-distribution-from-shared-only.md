# [Test: Term Distribution From Shared only](#test-term-distribution-from-shared-only)

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous terms, only, which are contributing to multiple glossary's refCount each

*   '[Shared AB][1][<sup>2)</sup>][2]'
*   '[Shared BC][3][<sup>2)</sup>][4]'

THEN mentions of ambiguous terms

*   '[Shared AB][1][<sup>2)</sup>][2]' MUST be linked to term definitions in glossary order B, A
*   '[Shared BC][3][<sup>2)</sup>][4]' MUST be linked to term definitions in glossary order B, C

due to distribution of term occurrences (including ambiguous terms in GIVEN and THEN)...

    refCount
        ^
      4_|       _
      3_|      | |
      2_|   _  | |  _
      1_|  | | | | | |
      0_|  |2| |4| |2|
        +-|---|---|---|---> Glossary
          | A | B | C |

...proving that counting unambiguous term occurrences, only, is not sufficient
AND counting ambiguous term occurrences, too, makes a difference.

[1]: ./glossary-b.md#shared-ab "defined in glossary B and A."

[2]: ./glossary-a.md#shared-ab "defined in glossary A and B."

[3]: ./glossary-b.md#shared-bc "defined in glossary B and C."

[4]: ./glossary-c.md#shared-bc "defined in Glossary C and B."
