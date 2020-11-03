# [Unique Anchor IDs](#unique-anchor-ids)

### [Test Case: Unique anchor ids when generated](#test-case-unique-anchor-ids-when-generated)

GIVEN two tables without a caption AND same columns
THEN unique anchor ids must be generated.

Table 1:

<a id="column1_ambiguous-column2_ambiguous" class="table" title="Column1_Ambiguous, Column2_Ambiguous" />

| Column1_Ambiguous | Column2_Ambiguous |
| ----------------- | ----------------- |
| Col1Row1          | Col2Row1          |
| Col1Row2          | Col2Row2          |

Table 2:

<a id="column1_ambiguous-column2_ambiguous-1" class="table" title="Column1_Ambiguous, Column2_Ambiguous" />

| Column1_Ambiguous | Column2_Ambiguous |
| ----------------- | ----------------- |
| Col1Row1          | Col2Row1          |
| Col1Row2          | Col2Row2          |

### [Test Case: Unique anchor ids when labels are ambiguous](#test-case-unique-anchor-ids-when-labels-are-ambiguous)

GIVEN two tables with identical captions
THEN unique anchor ids must be generated.

<!-- table: Ambiguous -->

<a id="ambiguous" class="table" title="Ambiguous" />

| Column1  | Column2  |
| -------- | -------- |
| Col1Row1 | Col2Row1 |
| Col1Row2 | Col2Row2 |

<!-- table: Ambiguous -->

<a id="ambiguous-1" class="table" title="Ambiguous" />

| Column1  | Column2  |
| -------- | -------- |
| Col1Row1 | Col2Row1 |
| Col1Row2 | Col2Row2 |
