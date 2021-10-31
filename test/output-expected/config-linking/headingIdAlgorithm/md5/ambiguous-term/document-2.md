# [Document 2](#md5-765ab5bc8d9f670188c34e86e6b88743)

GIVEN two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that

AND output must be the same as if processed by `linking.headingIdAlgorithm: "github"`
EXCEPT for a hash being used as a link target identifier.

[1]: ./glossary-1.md#md5-ba8f4f1932828457d5bb2a5559f24ba5 "First definition."

[2]: ./glossary-2.md#md5-f4f4e0e4c388bc462cfd125dae54b6f5 "Second definition."
