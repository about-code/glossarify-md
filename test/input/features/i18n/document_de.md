GIVEN term 'äöüß Term begins with Umlauts'
THEN the linker MUST link the term with its glossary definition.

GIVEN term 'Term ends with Umlauts äöüß'
THEN the linker MUST link the term with its glossary definition.

GIVEN term 'Term contains äöüß Umlauts'
THEN the linker MUST link the term with its glossary definition.

GIVEN term 'Der Tod und das Mädchen'
THEN the linker MUST link the term with its glossary definition.

GIVEN term 'Äquator'
THEN the linker MUST link the term with its glossary definition.

GIVEN compound term 'Äquatorregion' AND GIVEN 'Äquator' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition.

GIVEN compound term 'Faßöl' AND GIVEN 'Faß' is a glossary term
THEN the linker MUST NOT link the compound with its glossary definition.
