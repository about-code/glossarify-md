**Inferred Table Label from File**

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
WHEN the table's first row is all empty
AND no user-defined label exists
AND no section heading exists
THEN in the generated output file the table MUST be linked to this section
AND the link text MUST equal './table-label-file/table-label-file.md'

||||
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |
