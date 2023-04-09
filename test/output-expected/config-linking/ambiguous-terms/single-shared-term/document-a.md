# [Document A](#document-a)

GIVEN two glossaries 'Glossary A' and 'Glossary B'
AND a term '[Shared Term][1][<sup>2)</sup>][2]' defined in both glossaries
AND a term '[Distinct Term A][3]' defined in Glossary A, only
THEN

*   the first definition linked with the shared term MUST be the definition in Glossary A
*   the second definition linked with the shared term MUST be the definition in Glossary B

because of

*   occurrence of an unambiguous term of Glossary A
*   AND NOT occurrence of some unambiguous term of Glossary B

[1]: ./glossary-a.md#shared-term "defined in glossary A."

[2]: ./glossary-b.md#shared-term "defined in glossary B."

[3]: ./glossary-a.md#distinct-term-a "defined in glossary A, only."
