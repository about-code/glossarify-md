# Table Anchorization

### Test Case: Table Anchor Exists

- GIVEN a markdown table

  <a id="my-id" class="table" title="this was not generated"></a>

  | Column1  | Column2  |
  | -------- | -------- |
  | Col1Row1 | Col2Row1 |
  | Col1Row2 | Col2Row2 |

- WITH an HTML anchor already being present such that the input markdown is
  ~~~
  <a id="my-id" class="table" title="this was not generated"></a>

  | Column1  | Column2  |
  | -------- | -------- |
  | Col1Row1 | Col2Row1 |
  | Col1Row2 | Col2Row2 |
  ~~~
- THEN `listOfTables` MUST NOT prepend yet another anchor.
