# [User-Defined Invisible Table Label Comments](#user-defined-invisible-table-label-comments)

## [Test Case: Comment Pattern Matches](#test-case-comment-pattern-matches)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with an HTML comment adhering to pattern `<!-- table: Label from Comment -->`
THEN in the generated output file the table MUST be linked to this file
AND the link text MUST be "Label from Comment".

<!-- table: Label from Comment -->

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

## [Test Case: Comment Pattern Misses 'table:'](#test-case-comment-pattern-misses-table)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
WHEN preceded with an HTML comment `<!-- Invalid Label Comment -->`
WITH comment missing the prefix `table: `
THEN in the generated output file the table MUST be linked to this file
AND the link text MUST equal 'Column 1, Column 2, Column 3'.

<!-- Invalid Label Comment -->

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |
