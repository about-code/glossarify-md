# [Document B](#document-b)

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' defined in all glossaries
AND this document mentions uniquely defined terms

*   '[Only A][4]'
*   '[Only B][5]', '[Only B][5]', '[Only B][5]'
*   '[Only C][6]', '[Only C][6]'

THEN there is a distribution of uniquely defined term occurrences

*Usage of uniquely defined glossary terms in this file:*

      Unequivocal
        Terms
          ^
          |
        3_|                  _
        2_|                 | |           _
        1_|     _           | |          | |
        0_|    |1|          |3|          |2|
          +------------|------------|------------|--> from Glossary
            Glossary A | Glossary B | Glossary C |

AND ambiguous term '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' MUST be linked to term definitions in glossaries A, B and C
AND the order of links must be sorted according to the number of uniquely defined term uses WITH

1.  link to definition in Glossary B, first
2.  link to definition in Glossary C, second
3.  link to definition in Glossary A, third

[1]: ./glossary-b.md#shared-all "defined in glossary B and all others."

[2]: ./glossary-c.md#shared-all "defined in glossary C and all others."

[3]: ./glossary-a.md#shared-all "defined in glossary A and all others."

[4]: ./glossary-a.md#only-a "defined in glossary A, only."

[5]: ./glossary-b.md#only-b "defined in glossary B, only."

[6]: ./glossary-c.md#only-c "defined in Glossary C, only."
