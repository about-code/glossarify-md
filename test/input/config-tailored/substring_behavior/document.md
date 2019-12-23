# Substring Test Document

## A

GIVEN a term 'A' WITH 'A' being atomic
 AND itself being substring of terms 'AB' AND 'ABC',
THEN 'A' MUST be correctly linked to its definition of 'A'
 AND other terms MUST NOT be affected by the definition of 'A'.

## AB

GIVEN a term 'AB' WITH another term 'A' being substring of it,
 AND itself being substring of 'ABC'
THEN 'AB' MUST be linked as a single term to its definition of 'AB'
 AND 'AB' MUST NOT be split by a link to the definition of 'A'.


## ABC

GIVEN a term 'ABC' WITH other terms 'AB' AND 'A' being substrings of it,
THEN 'ABC' MUST be linked as a single term to its definition of 'ABC'
 AND 'ABC' MUST NOT be split by a link to the definition of 'AB'
 AND 'ABC' MUST NOT be split by a link to the definition of 'A'

## Ä

GIVEN a non-ASCII term 'Ä' WITH 'Ä' being atomic
 AND itself being substring of terms 'ÄÖ' AND 'ÄÖÜ',
THEN 'Ä' MUST be correctly linked to its definition of 'Ä'
 AND other terms MUST NOT be affected by the definition of 'Ä'.

## ÄÖ

GIVEN a non-ASCII term 'ÄÖ' WITH another term 'Ä' being substring of it,
 AND itself being substring of 'ÄÖÜ'
THEN 'ÄÖ' MUST be linked as a single term to its definition of 'ÄÖ'
 AND 'ÄÖ' MUST NOT be split by a link to the definition of 'Ä'.


## ÄÖÜ

GIVEN a non-ASCII term 'ÄÖÜ' WITH other terms 'ÄÖ' AND 'Ä' being substrings of it,
THEN 'ÄÖÜ' MUST be linked as a single term to its definition of 'ÄÖÜ'
 AND 'ÄÖÜ' MUST NOT be split by a link to the definition of 'ÄÖ'
 AND 'ÄÖÜ' MUST NOT be split by a link to the definition of 'Ä'
