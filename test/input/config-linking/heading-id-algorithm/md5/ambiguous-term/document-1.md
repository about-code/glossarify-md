# Document 1

GIVEN two documents *Document 1* and *Document 2*, both mentioning term Alpha
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN in the generated index file

1. there MUST be *one* entry for the term
1. AND there MUST be *two* glossaries linked under that entry
1. AND there MUST be *two* documents linked under that

AND output must be the same as if processed by `linking.headingIdAlgorithm: "github"`
EXCEPT for a hash being used as a link target identifier.
