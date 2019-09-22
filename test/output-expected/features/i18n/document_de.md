GIVEN term '[äöüß Term begins with Umlauts][1]'
THEN the linker MUST link the term with its glossary definition.

GIVEN term '[Term ends with Umlauts äöüß][2]'
THEN the linker MUST link the term with its glossary definition.

GIVEN term '[Term contains äöüß Umlauts][3]'
THEN the linker MUST link the term with its glossary definition.

GIVEN term '[Der Tod und das Mädchen][4]'
THEN the linker MUST link the term with its glossary definition.

GIVEN term '[Äquator][5]'
THEN the linker MUST link the term with its glossary definition.

GIVEN compound term 'Äquatorregion' AND GIVEN '[Äquator][5]' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition.

GIVEN compound term 'Faßöl' AND GIVEN '[Faß][6]' is a glossary term
THEN the linker MUST NOT link the compound with its glossary definition.

[1]: glossary_de.md#äöüß-term-begins-with-umlauts

[2]: glossary_de.md#term-ends-with-umlauts-äöüß

[3]: glossary_de.md#term-contains-äöüß-umlauts

[4]: glossary_de.md#der-tod-und-das-mädchen

[5]: glossary_de.md#äquator

[6]: glossary_de.md#faß
