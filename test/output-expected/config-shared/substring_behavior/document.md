# [Substring Test Document][1]

## [A][2]

GIVEN a term '[A][3]' WITH '[A][3]' being atomic
 AND itself being substring of terms '[AB][4]' AND '[ABC][5]',
THEN '[A][3]' MUST be correctly linked to its definition of '[A][3]'
 AND other terms MUST NOT be affected by the definition of '[A][3]'.

## [AB][6]

GIVEN a term '[AB][4]' WITH another term '[A][3]' being substring of it,
 AND itself being substring of '[ABC][5]'
THEN '[AB][4]' MUST be linked as a single term to its definition of '[AB][4]'
 AND '[AB][4]' MUST NOT be split by a link to the definition of '[A][3]'.

## [ABC][7]

GIVEN a term '[ABC][5]' WITH other terms '[AB][4]' AND '[A][3]' being substrings of it,
THEN '[ABC][5]' MUST be linked as a single term to its definition of '[ABC][5]'
 AND '[ABC][5]' MUST NOT be split by a link to the definition of '[AB][4]'
 AND '[ABC][5]' MUST NOT be split by a link to the definition of '[A][3]'

## [Ä][8]

GIVEN a non-ASCII term '[Ä][9]' WITH '[Ä][9]' being atomic
 AND itself being substring of terms ['ÄÖ'][10] AND ['ÄÖÜ'][11],
THEN '[Ä][9]' MUST be correctly linked to its definition of '[Ä][9]'
 AND other terms MUST NOT be affected by the definition of '[Ä][9]'.

## [ÄÖ][12]

GIVEN a non-ASCII term ['ÄÖ'][10] WITH another term '[Ä][9]' being substring of it,
 AND itself being substring of ['ÄÖÜ'][11]
THEN ['ÄÖ'][10] MUST be linked as a single term to its definition of ['ÄÖ'][10]
 AND ['ÄÖ'][10] MUST NOT be split by a link to the definition of '[Ä][9]'.

## [ÄÖÜ][13]

GIVEN a non-ASCII term ['ÄÖÜ'][11] WITH other terms ['ÄÖ'][10] AND '[Ä][9]' being substrings of it,
THEN ['ÄÖÜ'][11] MUST be linked as a single term to its definition of ['ÄÖÜ'][11]
 AND ['ÄÖÜ'][11] MUST NOT be split by a link to the definition of ['ÄÖ'][10]
 AND ['ÄÖÜ'][11] MUST NOT be split by a link to the definition of '[Ä][9]'

[1]: #substring-test-document

[2]: #a

[3]: glossary.md#a "GIVEN an atomic term 'A' WITH term 'A' being a substring of 'AB' and 'ABC'"

[4]: glossary.md#ab "GIVEN a term 'AB' WITH term A being a substring of it and itself being substring of 'ABC'"

[5]: glossary.md#abc "GIVEN a term 'ABC' WITH terms 'AB' and A being substrings of it"

[6]: #ab

[7]: #abc

[8]: #ä

[9]: glossary.md#ä "GIVEN an atomic non-ASCII term 'Ä' WITH term 'Ä' being a substring of 'ÄÖ' and 'ÄÖÜ'"

[10]: glossary.md#äö "GIVEN a term 'ÄÖ' WITH term 'Ä' being a substring of it and itself being substring of 'ÄÖÜ'"

[11]: glossary.md#äöü "GIVEN a term 'ÄÖÜ' WITH terms 'ÄÖ' and 'Ä' being substrings of it"

[12]: #äö

[13]: #äöü
