# Unique Anchor IDs

### Test Case: Unique anchor ids when generated

GIVEN two tables without a caption AND same columns
THEN unique anchor ids must be generated.

Table 1:

| Column1_Ambiguous | Column2_Ambiguous |
| ----------------- | ----------------- |
| Col1Row1          | Col2Row1          |
| Col1Row2          | Col2Row2          |


Table 2:

| Column1_Ambiguous | Column2_Ambiguous |
| ----------------- | ----------------- |
| Col1Row1          | Col2Row1          |
| Col1Row2          | Col2Row2          |


### Test Case: Unique anchor ids when labels are ambiguous

GIVEN two tables with identical captions
THEN unique anchor ids must be generated.

<!-- table: Ambiguous -->
| Column1  | Column2  |
| -------- | -------- |
| Col1Row1 | Col2Row1 |
| Col1Row2 | Col2Row2 |


<!-- table: Ambiguous -->
| Column1  | Column2  |
| -------- | -------- |
| Col1Row1 | Col2Row1 |
| Col1Row2 | Col2Row2 |
