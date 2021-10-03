# Document

## Section

GIVEN a document *Document* mentioning glossary term *Term*
AND a configuration `linking.headingIdAlgorithm: "md5-7"`
THEN the system must produce heading identifiers with a hashsum shortend to 7 characters
AND a prefix which begins with a non-numeric alpha ASCII character for HTML id attribute backwards compatibility.
