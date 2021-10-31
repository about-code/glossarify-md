# [Document 2](#sha256-cdfbad2)

GIVEN two glossaries with a term [Alpha][1][<sup>2)</sup>][2]
AND two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "sha256-7"`
THEN in the glossary files

1.  both terms MUST have a different hash value

AND in document files

1.  links MUST use a SHA256 URL fragment as a link target identifier

AND in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that entry

[1]: ./glossary-1.md#sha256-12fca02 "First definition."

[2]: ./glossary-2.md#sha256-9c50dbf "Second definition."
