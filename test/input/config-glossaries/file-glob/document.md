# Testing file globs

- GIVEN a configuration

   ~~~json
   glossaries: [{
       "file": "./**/document.md"
       ,"termHint": "~"
   }]
   ~~~

- WITH a **glob pattern**
- AND WITH a **termHint**
- AND multiple documents matching the glob pattern
- THEN

   - all terms and headings in those documents MUST be treated like terms
   - AND `termHint` *CAN* be ignored if it is too costly to find out whether a file is being processed as a glossary file due to this particular glob pattern

## Root

Test term at the root level in the folder tree.

## Test Case: using term from 2nd level

GIVEN a glob pattern to identify glossary files
AND a term "Second Level" in a document at the 2nd level in the folder hierarchy
THEN this term MUST be linkified.

## Test Case: using a term from 3rd level

GIVEN a glob pattern to identify glossary files
AND a term "Third Level" in a document at the 3rd level in the folder hierarchy
THEN this term MUST be linkified.

## Test Case: using term from unmatched document

GIVEN a document "./unmatched.md"
WITH a heading "Unmatched" of depth >= 2
AND the term "Unmatched" being used in *this* document
WITH *this* document matching the glob pattern
THEN the term from the unmatched document MUST NOT be linkified.
