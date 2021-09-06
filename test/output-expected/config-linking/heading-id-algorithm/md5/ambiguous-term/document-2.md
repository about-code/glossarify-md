# [Document 2](#id-2a7bfdf9270386e2ee321d898a031fa1)

GIVEN two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that

AND output must be the same as if processed by `linking.headingIdAlgorithm: "github"`
EXCEPT for a hash being used as a link target identifier.

[1]: ./glossary-1.md#id-1a319298ee8172465c1b9a7c00a454bb "First definition."

[2]: ./glossary-2.md#id-2014cd002823f23a930ec129344581c3 "Second definition."
