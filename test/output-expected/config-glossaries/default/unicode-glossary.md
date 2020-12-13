# [Unicode Tests](#unicode-tests)

<!-- =========== DE ============= -->

## [äöüß Term begins with Umlauts](#äöüß-term-begins-with-umlauts)

Testing German Umlauts.

## [Term ends with Umlauts äöüß](#term-ends-with-umlauts-äöüß)

Testing German Umlauts.

## [Term contains äöüß Umlauts](#term-contains-äöüß-umlauts)

Testing German Umlauts.

## [Der Tod und das Mädchen](#der-tod-und-das-mädchen)

Classical composition by Franz Schubert (The Death and the Maiden).

## [Äquator](#äquator)

GIVEN a compound term 'Äquatorregion' AND GIVEN '[Äquator][1]' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition.

## [Faß](#faß)

GIVEN a compound term 'Faßöl'
WITH '[Faß][2]' being a glossary term
AND '[Faß][2]' ending with a non-ASCII character
AND 'öl' beginning with a non-ASCII character
THEN 'Faßöl' MUST NOT be split into two words
AND 'Faßöl' MUST NOT be linked to the glossary definition of '[Faß][2]'.

<!-- =========== ZH ============= -->

## [中国](#中国)

China

## [zhōngguó](#zhōngguó)

China (spelling)

## [中国China](#中国china)

Word begins with symbols

## [China中国](#china中国)

Word ends with symbols

## [中China国](#中china国)

Word begins and ends with symbols

## [Chi中国na](#chi中国na)

Word contains symbols

[1]: #äquator "GIVEN a compound term 'Äquatorregion' AND GIVEN 'Äquator' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition."

[2]: #faß "GIVEN a compound term 'Faßöl'
WITH 'Faß' being a glossary term
AND 'Faß' ending with a non-ASCII character
AND 'öl' beginning with a non-ASCII character
THEN 'Faßöl' MUST NOT be split into two words
AND 'Faßöl' MUST NOT be linked to the glossary definition of 'Faß'."
