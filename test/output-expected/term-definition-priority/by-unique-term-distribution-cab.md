# [Document B](#document-b)

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous terms

*   '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]'
*   '[Shared AB][4][<sup>2)</sup>][5]'
*   '[Shared AB][4][<sup>2)</sup>][5]', '[Shared BC][6][<sup>2)</sup>][7]'
*   '[Shared BC][6][<sup>2)</sup>][7]'

AND this document mentions uniquely defined terms

*   '[Only A][8]', '[Only A][8]'
*   '[Only B][9]'
*   '[Only C][10]', '[Only C][10]', '[Only C][10]'

THEN there is a distribution of uniquely defined term occurrences

*Usage of uniquely defined glossary terms in this file:*

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

AND ambiguous term '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' MUST be linked to term definitions in order C, A, B
AND ambiguous term '[Shared AB][4][<sup>2)</sup>][5]'  MUST be linked to term definitions in order A, B
AND ambiguous term '[Shared BC][6][<sup>2)</sup>][7]'  MUST be linked to term definitions in order C, B

[1]: ./glossary-c.md#shared-all "defined in glossary C and all others."

[2]: ./glossary-a.md#shared-all "defined in glossary A and all others."

[3]: ./glossary-b.md#shared-all "defined in glossary B and all others."

[4]: ./glossary-a.md#shared-ab "defined in glossary A and B."

[5]: ./glossary-b.md#shared-ab "defined in glossary B and A."

[6]: ./glossary-c.md#shared-bc "defined in Glossary C and B."

[7]: ./glossary-b.md#shared-bc "defined in glossary B and C."

[8]: ./glossary-a.md#only-a "defined in glossary A, only."

[9]: ./glossary-b.md#only-b "defined in glossary B, only."

[10]: ./glossary-c.md#only-c "defined in Glossary C, only."
