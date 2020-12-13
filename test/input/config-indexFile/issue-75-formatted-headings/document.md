# Document

## `FooClass`

- GIVEN a section with 'Term' occurrence
- AND the section title is formatted
- THEN the indexer MUST NOT produce links without label
    ```
    ## Term
    [][9]

    [9]: ./glossary.md#term ... a term
    ```
    which subsequently cause error

    ```
    TypeError: Cannot read property 'length' of undefined
    at Of.escape ({redacted}/glossarify-md/node_modules/remark-stringify/lib/escape.js:64:24)
    ```

- AND MUST produce links with label

    ```
    ## Term
    [FooClass][9]

    [9]: ./glossary.md#term ... a term
    ```
