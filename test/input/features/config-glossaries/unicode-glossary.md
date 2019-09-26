# Unicode Tests

<!-- =========== DE ============= -->

## äöüß Term begins with Umlauts

Testing German Umlauts.

## Term ends with Umlauts äöüß

Testing German Umlauts.

## Term contains äöüß Umlauts

Testing German Umlauts.

## Der Tod und das Mädchen

Classical composition by Franz Schubert (The Death and the Maiden).

## Äquator

GIVEN a compound term 'Äquatorregion' AND GIVEN 'Äquator' is a glossary term
THEN the linker MUST NOT link the compound with a glossary definition.

## Faß

GIVEN a compound term 'Faßöl'
WITH 'Faß' being a glossary term
 AND 'Faß' ending with a non-ASCII character
 AND 'öl' beginning with a non-ASCII character
THEN 'Faßöl' MUST NOT be split into two words
AND 'Faßöl' MUST NOT be linked to the glossary definition of 'Faß'.


<!-- =========== ZH ============= -->

## 中国
China

## zhōngguó
China (spelling)

## 中国China
Word begins with symbols

## China中国
Word ends with symbols

## 中China国
Word begins and ends with symbols

## Chi中国na
Word contains symbols
