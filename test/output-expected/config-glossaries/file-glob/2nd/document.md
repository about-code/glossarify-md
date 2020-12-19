# [2nd Level](#2nd-level)

## [Second Level](#second-level)

Term at the second level in the folder hierarchy.

## [Test Case: Using a term from this document](#test-case-using-a-term-from-this-document)

GIVEN a glob pattern to identify glossary files
AND a term "[Second Level][1]" within _this_ document
THEN the term must be linked to the section in this document.

## [Test Case: Using a term from root level](#test-case-using-a-term-from-root-level)

GIVEN a glob pattern to identify glossary files
AND a term "[Root][2]" in a document at the root level in the folder hierarchy
THEN this term MUST be linkified.

## [Test Case: Using a term from 3rd level](#test-case-using-a-term-from-3rd-level)

GIVEN a glob pattern to identify glossary files
AND a term "[Third Level][3]" in a document at the 3rd level in the folder hierarchy
THEN this term MUST be linkified.

[1]: #second-level "Term at the second level in the folder hierarchy."

[2]: ../document.md#root "Test term at the root level in the folder tree."

[3]: ./3rd/document.md#third-level "Term at the third level in the folder hierarchy."
