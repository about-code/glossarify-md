# [Document](#md5:9a6dcfa)

## [Section](#md5:9acfaec)

GIVEN a document *Document* mentioning glossary term *[Term][1]*
AND a configuration `linking.headingIdAlgorithm: "md5-7"`
THEN the system must produce heading identifiers with a hashsum shortend to 7 characters
AND a prefix which begins with a non-numeric alpha ASCII character for HTML id attribute backwards compatibility.

[1]: ./glossary.md#md5:22285b0 "Term definition."
