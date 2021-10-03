# [Document 2](#document-2)

GIVEN one glossary with the same term [Alpha][1][<sup>2)</sup>][2] being defined twice
AND two documents *Document 1* and *Document 2*, both mentioning term [Alpha][1][<sup>2)</sup>][2]
AND a configuration `linking.headingIdAlgorithm: "github"`
THEN in the glossary files

1.  both terms MUST have different heading identifiers (link fragments)
2.  AND heading identifiers MUST use a GitHub-Slug URL fragment with a numeric suffix

AND in document files

1.  links MUST use a GitHub-Slug URL fragment as a link target identifier

AND in the generated index file

1.  there MUST be *one* entry for the term
2.  AND there MUST be *two* glossaries linked under that entry
3.  AND there MUST be *two* documents linked under that entry

[1]: ./glossary.md#alpha "First definition."

[2]: ./glossary.md#alpha-1 "Second definition."
