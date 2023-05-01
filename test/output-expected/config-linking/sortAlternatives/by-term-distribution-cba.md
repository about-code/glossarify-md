# [Test: Term Distribution CBA](#test-term-distribution-cba)

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term contributing to multiple glossary's refCount

*   '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]'

AND this document mentions unambiguous terms contributing to a single glossary's refCount each

*   '[Only A][4]'
*   '[Only B][5]', '[Only B][5]'
*   '[Only C][6]', '[Only C][6]', '[Only C][6]'

THEN mentions of ambiguous term

*   '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' MUST be linked to term definitions in glossary order C, B and A

due to distribution of term occurrences (including ambiguous terms in GIVEN and THEN)

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

[1]: ./glossary-c.md#shared-all "defined in glossary C and all others."

[2]: ./glossary-b.md#shared-all "defined in glossary B and all others."

[3]: ./glossary-a.md#shared-all "defined in glossary A and all others."

[4]: ./glossary-a.md#only-a "defined in glossary A, only."

[5]: ./glossary-b.md#only-b "defined in glossary B, only."

[6]: ./glossary-c.md#only-c "defined in Glossary C, only."
