<!-- =========== DE ============= -->

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

GIVEN a compound term 'Äquatorregion' AND GIVEN 'Äquator' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition.

GIVEN a compound term 'Faßöl'
WITH 'Faß' being a glossary term
 AND 'Faß' ending with a non-ASCII character
 AND 'öl' beginning with a non-ASCII character
THEN 'Faßöl' MUST NOT be split into two words
AND 'Faßöl' MUST NOT be linked to the glossary definition of 'Faß'.

<!-- =========== ZH ============= -->

GIVEN a term '中国' with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term 'zhōngguó' with non-ASCII symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '中国China' beginning with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term 'China中国' ending with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '中China国' beginning and ending with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term 'Chi中国na' containing non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.
