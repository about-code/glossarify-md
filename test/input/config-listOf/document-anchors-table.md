# Anchors

## Tables

### Test Case: Table Comment in Distinct Paragraph

- GIVEN an input document

  ```md
  <!-- table: Table Comment in Paragraph -->

  | Test1_Column1 | Test1_Column2 |
  | ------------- | ------------- |
  | Col1Row1      | Col2Row1      |
  | Col1Row2      | Col2Row2      |
  ```

- WITH a Markdown table
- AND an HTML table comment in a distinct paragraph
- THEN the system MUST prepend a new anchor

#### Test Data

<!-- table: Table Comment in Paragraph -->

| Test1_Column1 | Test1_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |


### Test Case: Table Comment in same Paragraph

- GIVEN an input document

  ```md
  <!-- table: Table Comment -->
  | Test2_Column1 | Test2_Column2 |
  | ------------- | ------------- |
  | Col1Row1      | Col2Row1      |
  | Col1Row2      | Col2Row2      |
  ```

- WITH a Markdown table
- AND an HTML table comment in the same paragraph as the table
- THEN the system SHOULD prepend a new anchor

#### Test Data

<!-- table: Table Comment -->

| Test2_Column1 | Test2_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |


### Test Case: HTML node in standalone Paragraph

- GIVEN an input document

  ```md
  <a id="my-id" class="table"></a>

  | Test3_Column1 | Test3_Column2 |
  | ------------- | ------------- |
  | Col1Row1      | Col2Row1      |
  | Col1Row2      | Col2Row2      |
  ```

- WITH a Markdown table
- AND a paragraph with a single child being an HTML node
- THEN the system MUST NOT prepend yet another anchor

#### Test Data

<a id="my-id" class="table"></a>

| Test3_Column1 | Test3_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |


### Test Case: 'html' node then 'text' node then 'table' node

- GIVEN an input document

  ```md
  <a id="my-other-table" class="table"></a> followed by text

  | Test4_Column1 | Test4_Column2 |
  | ------------- | ------------- |
  | Col1Row1      | Col2Row1      |
  | Col1Row2      | Col2Row2      |
  ```

- WITH a Markdown table
- AND a paragraph terminated by a 'text' node
- THEN the system SHOULD prepend a new anchor

#### Test Data

<a id="my-other-table" class="table"></a> followed by text

| Test4_Column1 | Test4_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |


### Test Case: Unique anchor ids when column headers identical

- GIVEN two tables without a caption
- AND same column headers
- THEN unique anchor ids MUST be generated

#### Test Data

Table 1:

| Test5_Column1 | Test5_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |


Table 2:

| Test5_Column1 | Test5_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |


### Test Case: Unique anchor ids when labels are ambiguous

- GIVEN two tables with identical captions
- THEN unique anchor ids must be generated.

#### Test Data

<!-- table: Ambiguous -->
| Test6_Column1 | Test6_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

<!-- table: Ambiguous -->
| Test6_Column1 | Test6_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |
