# [User-Defined Visible Table Labels](#user-defined-visible-table-labels)

### [Test Case: Separate Paragraph Match](#test-case-separate-paragraph-match)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table preceded by a colon-terminated italic paragraph
WITH text '_Label from paragraph:_'
THEN in the generated output file the table MUST be linked to this section AND the link text MUST be 'Label from paragraph'
AND not terminated by a colon.

_Label from paragraph:_

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### [Test Case: Separate Paragraph Colon Missing](#test-case-separate-paragraph-colon-missing)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table preceded by an italic paragraph '_Label from paragraph_'
WHEN text is NOT terminated by a colon
THEN in the generated output file the table label MUST equal 'Column 1, Column 2, Column 3'

_Label from paragraph_

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### [Test Case: Inline Match](#test-case-inline-match)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with a colon-terminated italic text '_Label from inlined text:_'
THEN in the generated output file the table MUST be linked to this section AND the link text MUST be 'Label from inlined text'
AND not terminated by a colon.

Paragraph with _Label from inlined text:_

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### [Test Case: Inline Colon Is Missing](#test-case-inline-colon-is-missing)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with an italic text '_invalid inline label missing the terminating colon_'
WHEN text is NOT terminated by colon
THEN in the generated output file the table label MUST equal 'Column 1, Column 2, Column 3'

Paragraph with _invalid inline label missing the terminating colon_

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |
