# [Document 1](#md5:2ee7430571fbf0131068a132b86a58f8)

GIVEN two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that

AND output must be the same as if processed by `linking.headingIdAlgorithm: "github"`
EXCEPT for a hash being used as a link target identifier.

[1]: ./glossary-1.md#md5:90620a4d9e83ed5d23be37255071123d "First definition."

[2]: ./glossary-2.md#md5:069dc1a0f28ef56508b16a61ca7cd681 "Second definition."
