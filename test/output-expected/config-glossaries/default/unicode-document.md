<!-- =========== DE ============= -->

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

GIVEN a compound term 'Äquatorregion' AND GIVEN '[Äquator][5]' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition.

GIVEN a compound term 'Faßöl'
WITH '[Faß][6]' being a glossary term
AND '[Faß][6]' ending with a non-ASCII character
AND 'öl' beginning with a non-ASCII character
THEN 'Faßöl' MUST NOT be split into two words
AND 'Faßöl' MUST NOT be linked to the glossary definition of '[Faß][6]'.

<!-- =========== ZH ============= -->

GIVEN a term '[中国][7]' with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '[zhōngguó][8]' with non-ASCII symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '[中国China][9]' beginning with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '[China中国][10]' ending with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '[中China国][11]' beginning and ending with non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

GIVEN a term '[Chi中国na][12]' containing non-ASCII chinese symbols
THEN the linker MUST link the term with its glossary definition.

[1]: ./unicode-glossary.md#äöüß-term-begins-with-umlauts "Testing German Umlauts."

[2]: ./unicode-glossary.md#term-ends-with-umlauts-äöüß "Testing German Umlauts."

[3]: ./unicode-glossary.md#term-contains-äöüß-umlauts "Testing German Umlauts."

[4]: ./unicode-glossary.md#der-tod-und-das-mädchen "Classical composition by Franz Schubert (The Death and the Maiden)."

[5]: ./unicode-glossary.md#äquator "GIVEN a compound term 'Äquatorregion' AND GIVEN 'Äquator' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition."

[6]: ./unicode-glossary.md#faß "GIVEN a compound term 'Faßöl'
WITH 'Faß' being a glossary term
AND 'Faß' ending with a non-ASCII character
AND 'öl' beginning with a non-ASCII character
THEN 'Faßöl' MUST NOT be split into two words
AND 'Faßöl' MUST NOT be linked to the glossary definition of 'Faß'."

[7]: ./unicode-glossary.md#中国 "China"

[8]: ./unicode-glossary.md#zhōngguó "China (spelling)"

[9]: ./unicode-glossary.md#中国china "Word begins with symbols"

[10]: ./unicode-glossary.md#china中国 "Word ends with symbols"

[11]: ./unicode-glossary.md#中china国 "Word begins and ends with symbols"

[12]: ./unicode-glossary.md#chi中国na "Word contains symbols"
