# [3rd level](#3rd-level)

## [Third Level](#third-level)

Term at the third level in the folder hierarchy.

## [Test Case: Using a term from 2nd level](#test-case-using-a-term-from-2nd-level)

GIVEN a glob pattern to identify glossary files
AND a term "[Second Level][1]" in a document at the 2nd level in the folder hierarchy
THEN this term MUST be linkified.

## [Test Case: Using a term from root level](#test-case-using-a-term-from-root-level)

GIVEN a glob pattern to identify glossary files
AND a term "[Root][2]" in a document at the root level in the folder hierarchy
THEN this term MUST be linkified.

[1]: ../document.md#second-level "Term at the second level in the folder hierarchy."

[2]: ../../document.md#root "Test term at the root level in the folder tree."
