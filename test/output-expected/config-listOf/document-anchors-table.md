# [Anchors](#anchors)

## [Tables](#tables)

### [Test Case: Table Comment in Distinct Paragraph](#test-case-table-comment-in-distinct-paragraph)

-   GIVEN an input document

    ```md
    <!-- table: Table Comment in Paragraph -->

    | Test1_Column1 | Test1_Column2 |
    | ------------- | ------------- |
    | Col1Row1      | Col2Row1      |
    | Col1Row2      | Col2Row2      |
    ```

-   WITH a Markdown table

-   AND an HTML table comment in a distinct paragraph

-   THEN the system MUST prepend a new anchor

#### [Test Data](#test-data)

<!-- table: Table Comment in Paragraph -->

<a id="table-comment-in-paragraph" class="table" title="Table Comment in Paragraph" />

| Test1_Column1 | Test1_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

### [Test Case: Table Comment in same Paragraph](#test-case-table-comment-in-same-paragraph)

-   GIVEN an input document

    ```md
    <!-- table: Table Comment -->
    | Test2_Column1 | Test2_Column2 |
    | ------------- | ------------- |
    | Col1Row1      | Col2Row1      |
    | Col1Row2      | Col2Row2      |
    ```

-   WITH a Markdown table

-   AND an HTML table comment in the same paragraph as the table

-   THEN the system SHOULD prepend a new anchor

#### [Test Data](#test-data-1)

<!-- table: Table Comment -->

<a id="table-comment" class="table" title="Table Comment" />

| Test2_Column1 | Test2_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

### [Test Case: HTML node in standalone Paragraph](#test-case-html-node-in-standalone-paragraph)

-   GIVEN an input document

    ```md
    <a id="my-id" class="table"></a>

    | Test3_Column1 | Test3_Column2 |
    | ------------- | ------------- |
    | Col1Row1      | Col2Row1      |
    | Col1Row2      | Col2Row2      |
    ```

-   WITH a Markdown table

-   AND a paragraph with a single child being an HTML node

-   THEN the system MUST NOT prepend yet another anchor

#### [Test Data](#test-data-2)

<a id="my-id" class="table"></a>

| Test3_Column1 | Test3_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

### [Test Case: 'html' node then 'text' node then 'table' node](#test-case-html-node-then-text-node-then-table-node)

-   GIVEN an input document

    ```md
    <a id="my-other-table" class="table"></a> followed by text

    | Test4_Column1 | Test4_Column2 |
    | ------------- | ------------- |
    | Col1Row1      | Col2Row1      |
    | Col1Row2      | Col2Row2      |
    ```

-   WITH a Markdown table

-   AND a paragraph terminated by a 'text' node

-   THEN the system SHOULD prepend a new anchor

#### [Test Data](#test-data-3)

<a id="my-other-table" class="table"></a> followed by text

<a id="test4_column1-test4_column2" class="table" title="Test4_Column1, Test4_Column2" />

| Test4_Column1 | Test4_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

### [Test Case: Unique anchor ids when column headers identical](#test-case-unique-anchor-ids-when-column-headers-identical)

-   GIVEN two tables without a caption
-   AND same column headers
-   THEN unique anchor ids MUST be generated

#### [Test Data](#test-data-4)

Table 1:

<a id="test5_column1-test5_column2" class="table" title="Test5_Column1, Test5_Column2" />

| Test5_Column1 | Test5_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

Table 2:

<a id="test5_column1-test5_column2-1" class="table" title="Test5_Column1, Test5_Column2" />

| Test5_Column1 | Test5_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

### [Test Case: Unique anchor ids when labels are ambiguous](#test-case-unique-anchor-ids-when-labels-are-ambiguous)

-   GIVEN two tables with identical captions
-   THEN unique anchor ids must be generated.

#### [Test Data](#test-data-5)

<!-- table: Ambiguous -->

<a id="ambiguous" class="table" title="Ambiguous" />

| Test6_Column1 | Test6_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |

<!-- table: Ambiguous -->

<a id="ambiguous-1" class="table" title="Ambiguous" />

| Test6_Column1 | Test6_Column2 |
| ------------- | ------------- |
| Col1Row1      | Col2Row1      |
| Col1Row2      | Col2Row2      |
