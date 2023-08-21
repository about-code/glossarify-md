# [Test: Term Distribution CAB](#test-term-distribution-cab)

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous terms contributing to multiple glossary's refCount

*   '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]'
*   '[Shared AB][4][<sup>2)</sup>][5]'
*   '[Shared BC][6][<sup>2)</sup>][7]'

AND this document mentions unambiguous terms contributing to a single glossary's refCount

*   '[Only A][8]', '[Only A][8]', '[Only A][8]'
*   '[Only C][9]', '[Only C][9]', '[Only C][9]', '[Only C][9]'

THEN mentions of ambiguous terms

*   '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' MUST be linked to term definitions in glossary order C, A, B
*   '[Shared AB][4][<sup>2)</sup>][5]'  MUST be linked to term definitions in glossary order A, B
*   '[Shared BC][6][<sup>2)</sup>][7]'  MUST be linked to term definitions in glossary order C, B

due to distribution of term occurrences (including counting ambiguous occurrences in GIVEN and THEN)

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

[1]: ./glossary-c.md#shared-all "defined in glossary C and all others."

[2]: ./glossary-a.md#shared-all "defined in glossary A and all others."

[3]: ./glossary-b.md#shared-all "defined in glossary B and all others."

[4]: ./glossary-a.md#shared-ab "defined in glossary A and B."

[5]: ./glossary-b.md#shared-ab "defined in glossary B and A."

[6]: ./glossary-c.md#shared-bc "defined in Glossary C and B."

[7]: ./glossary-b.md#shared-bc "defined in glossary B and C."

[8]: ./glossary-a.md#only-a "defined in glossary A, only."

[9]: ./glossary-c.md#only-c "defined in Glossary C, only."
