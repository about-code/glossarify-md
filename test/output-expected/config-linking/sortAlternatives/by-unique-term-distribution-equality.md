# [Document A](#document-a)

GIVEN three glossaries 'Glossary A' and 'Glossary B' and 'Glossary C'
AND this document mentions ambiguous term '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' defined in all glossaries
AND this document mentions uniquely defined terms '[Only A][4]', '[Only B][5]', '[Only C][6]' equally often
THEN there is an equal distribution of uniquely defined term occurrences

*Usage of uniquely defined glossary terms in this file:*

      Unequivocal
        Terms
          ^
        2_|
        1_|     _            _            _
        0_|    |1|          |1|          |1|
          +------------|------------|------------|--> from Glossary
            Glossary A | Glossary B | Glossary C |

AND term '[Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]' MUST be linked to all term definitions in glossaries A, B and C
AND the order of links must be alphabetically, descending WITH

1.  link to definition in Glossary A, first
2.  link to definition in Glossary B, second
3.  link to definition in Glossary C, third

[1]: ./glossary-a.md#shared-all "defined in glossary A and all others."

[2]: ./glossary-b.md#shared-all "defined in glossary B and all others."

[3]: ./glossary-c.md#shared-all "defined in glossary C and all others."

[4]: ./glossary-a.md#only-a "defined in glossary A, only."

[5]: ./glossary-b.md#only-b "defined in glossary B, only."

[6]: ./glossary-c.md#only-c "defined in Glossary C, only."
