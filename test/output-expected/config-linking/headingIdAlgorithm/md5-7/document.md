# [Document](#md5-0a9a7c4)

## [Section](#md5-6133199)

GIVEN a document *Document* mentioning glossary term *[Term][1]*
AND a configuration `linking.headingIdAlgorithm: "md5-7"`
THEN the system must produce heading identifiers with a hashsum shortend to 7 characters
AND a prefix which begins with a non-numeric alpha ASCII character for HTML id attribute backwards compatibility.

[1]: ./glossary.md#md5-7e9dfa8 "Term definition."
