# User-Defined Visible Table Labels

### Test Case: Separate Paragraph Match

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table preceded by a colon-terminated italic paragraph
WITH text '*Label from paragraph:*'
THEN in the generated output file the table MUST be linked to this section AND the link text MUST be 'Label from paragraph'
AND not terminated by a colon.

*Label from paragraph:*

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |


### Test Case: Separate Paragraph Colon Missing

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table preceded by an italic paragraph '*Label from paragraph*'
WHEN text is NOT terminated by a colon
THEN in the generated output file the table label MUST equal 'Column 1, Column 2, Column 3'

*Label from paragraph*

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |


### Test Case: Inline Match

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with a colon-terminated italic text '*Label from inlined text:*'
THEN in the generated output file the table MUST be linked to this section AND the link text MUST be 'Label from inlined text'
AND not terminated by a colon.

Paragraph with *Label from inlined text:*

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### Test Case: Inline Colon Is Missing

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with an italic text '*invalid inline label missing the terminating colon*'
WHEN text is NOT terminated by colon
THEN in the generated output file the table label MUST equal 'Column 1, Column 2, Column 3'

Paragraph with *invalid inline label missing the terminating colon*

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |
