# [Testing file globs on unmatched files](#testing-file-globs-on-unmatched-files)

-   GIVEN a configuration

    ```json
    glossaries: [{
        "file": "./**/document.md"
        ,"termHint": "~"
    }]
    ```

-   WITH a **glob pattern**

-   AND WITH a **termHint**

-   AND this document NOT matching the glob pattern

-   THEN

    -   all terms and headings in matched documents MUST be treated like terms
    -   all terms and headings in unmatched documents MUST NOT be linked
    -   term occurrences in unmatched documents MUST be linked with matched documents

## [Unmatched](#unmatched)

GIVEN a term "Unmatched"
AND the term being used in ./document.md
THEN the term being used their MUST NOT be linked to this heading.

## [Test Case](#test-case)

GIVEN a matched document "document.md" WITH a term "[Root][1]"
AND this document NOT matching the glob pattern
THEN the term MUST still be linkified.

[1]: ./document.md#root "Test term at the root level in the folder tree."
