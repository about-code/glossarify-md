# [Document](#md5-6d7c843)

## [Section](#md5-e5876b1)

GIVEN a document *Document* mentioning glossary term *[Term][1]*
AND a configuration `linking.headingIdAlgorithm: "md5-7"`
THEN the system must produce heading identifiers with a hashsum shortend to 7 characters
AND a prefix which begins with a non-numeric alpha ASCII character for HTML id attribute backwards compatibility.

[1]: ./glossary.md#md5-8b3b1b8 "Term definition."
