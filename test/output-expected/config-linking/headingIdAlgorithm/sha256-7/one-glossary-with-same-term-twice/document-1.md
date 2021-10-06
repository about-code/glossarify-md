# [Document 1](#sha256:2405b49)

GIVEN one glossary with the same term [Alpha][1][<sup>2)</sup>][2] being defined twice
AND two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "sha256-7"`
THEN in the glossary file

1.  both terms MUST have a different hash value

AND in document files

1.  links MUST use a SHA256 URL fragment as a link target identifier

AND in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that entry

[1]: ./glossary.md#sha256:04ac362 "First definition."

[2]: ./glossary.md#sha256:9580085 "Second definition."
