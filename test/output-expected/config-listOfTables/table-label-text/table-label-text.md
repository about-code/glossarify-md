# [User-Defined Visible Table Labels](#user-defined-visible-table-labels)

### [Test Case: Separate Paragraph Match](#test-case-separate-paragraph-match)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table preceded by a colon-terminated italic paragraph
WITH text '*Label from paragraph:*'
THEN in the generated output file the table MUST be linked to this section AND the link text MUST be 'Label from paragraph'
AND not terminated by a colon.

*Label from paragraph:*

<a id="label-from-paragraph" class="table" title="Label from paragraph" />

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### [Test Case: Separate Paragraph Colon Missing](#test-case-separate-paragraph-colon-missing)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table preceded by an italic paragraph '*Label from paragraph*'
WHEN text is NOT terminated by a colon
THEN in the generated output file the table label MUST equal 'Column 1, Column 2, Column 3'

*Label from paragraph*

<a id="column-1-column-2-column-3" class="table" title="Column 1, Column 2, Column 3" />

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### [Test Case: Inline Match](#test-case-inline-match)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with a colon-terminated italic text '*Label from inlined text:*'
THEN in the generated output file the table MUST be linked to this section AND the link text MUST be 'Label from inlined text'
AND not terminated by a colon.

Paragraph with *Label from inlined text:*

<a id="label-from-inlined-text" class="table" title="Label from inlined text" />

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |

### [Test Case: Inline Colon Is Missing](#test-case-inline-colon-is-missing)

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
preceded with an italic text '*invalid inline label missing the terminating colon*'
WHEN text is NOT terminated by colon
THEN in the generated output file the table label MUST equal 'Column 1, Column 2, Column 3'

Paragraph with *invalid inline label missing the terminating colon*

<a id="column-a-column-b-column-c" class="table" title="Column A, Column B, Column C" />

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |
