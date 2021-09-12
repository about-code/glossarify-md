# Count Term Occurrences

## Once

GIVEN a document
AND it mentions the term "Mentioned-in-document-once" once
AND noohere else
THEN the term's term occurrence count MUST be 1.

## Twice

GIVEN a document
AND it mentions the term "Mentioned-in-document-twice" once
AND it mentions the term "Mentioned-in-document-twice" twice
THEN the term's term occurrence count MUST be 2.
