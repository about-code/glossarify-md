# [Count Term Occurrences](#count-term-occurrences)

## [Once](#once)

GIVEN a document
AND it mentions the term "[Mentioned-in-document-once][1]" once
AND noohere else
THEN the term's term occurrence count MUST be 1.

## [Twice](#twice)

GIVEN a document
AND it mentions the term "[Mentioned-in-document-twice][2]" once
AND it mentions the term "[Mentioned-in-document-twice][2]" twice
THEN the term's term occurrence count MUST be 2.

[1]: ./glossary.md#mentioned-in-document-once "GIVEN a term
AND it is mentioned once in a document
AND not in the glossary
THEN this term's occurrence count MUST be 1."

[2]: ./glossary.md#mentioned-in-document-twice "GIVEN a term
AND it is mentioned twice in a document
AND not in the glossary
THEN this term's occurrence count MUST be 2."
