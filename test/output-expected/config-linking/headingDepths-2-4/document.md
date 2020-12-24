# [Testing option `linking.headingDepths`](#testing-option-linkingheadingdepths)

## [Linking Headings of Depth 2 and 4](#linking-headings-of-depth-2-and-4)

-   GIVEN a configuration
    ```json
    {
        "indexing": {
            "headingDepths": [1,2,3,4,5,6] // configured but currently also default
        },
        "linking": {
            "headingDepths": [2,4] // test-case
        }
    }
    ```
-   AND mentions of terms
    1.  Test-Case-1
    2.  [Test-Case-2][1]
    3.  Test-Case-3
    4.  [Test-Case-4][2]
    5.  Test-Case-5
    6.  Test-Case-6
-   THEN
    1.  Test-Case-1 MUST NOT have been linked
    2.  AND [Test-Case-2][1] MUST have been linked
    3.  AND Test-Case-3 MUST NOT have been linked
    4.  AND [Test-Case-4][2] MUST have been linked
    5.  AND Test-Case-5 MUST NOT have been linked
    6.  AND Test-Case-6 MUST NOT have been linked

[1]: ./glossary.md#test-case-2 "included"

[2]: ./glossary.md#test-case-4 "included"
