# Document 1

GIVEN two glossaries with a term Alpha
AND two documents *Document 1* and *Document 2*, both mentioning term Alpha
AND a configuration `linking.headingIdAlgorithm: "github"`
THEN in the glossary files

1. both terms MAY have identical heading identifiers (link fragments)
1. AND heading identifiers MUST use a GitHub-Slug URL fragment

AND in document files

1. links MUST use a GitHub-Slug URL fragment as a link target identifier

AND in the generated index file

1. there MUST be *one* entry for the term
1. AND there MUST be *two* glossaries linked under that entry
1. AND there MUST be *two* documents linked under that entry
