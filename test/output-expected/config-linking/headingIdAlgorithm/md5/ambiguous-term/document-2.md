# [Document 2](#md5-13167a421906f4accda09aad255fb639)

GIVEN two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that

AND output must be the same as if processed by `linking.headingIdAlgorithm: "github"`
EXCEPT for a hash being used as a link target identifier.

[1]: ./glossary-1.md#md5-3e5743fb44c2774df0009ab82b8b8b78 "First definition."

[2]: ./glossary-2.md#md5-52b33922916044f7a4f1e82766f49c6b "Second definition."
