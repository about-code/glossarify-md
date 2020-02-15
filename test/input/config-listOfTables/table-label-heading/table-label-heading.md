# Inferred Table Label from Section Heading

## Label from Section Heading

GIVEN a config option `generateFiles.listOfTables`
AND a markdown table
WHEN the table's first row is all empty
AND no user-defined label exists
THEN in the generated output file the table MUST be linked to this section AND the link text MUST equal its preceding heading 'Label from Section Heading'.

||||
| -------- | -------- | -------- |
| Col1Row3 | Col2Row3 | Col3Row3 |
| Col1Row4 | Col2Row4 | Col3Row4 |
