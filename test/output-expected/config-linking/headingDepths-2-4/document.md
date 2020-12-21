# [Testing option `linking.headingDepths`](#testing-option-linkingheadingdepths)

## [Linking Headings of Depth 2 and 4](#linking-headings-of-depth-2-and-4)

-   GIVEN a configuration
    ```json
    {
        "linking": {
            "headingDepths": [2,4]
        }
    }
    ```
-   AND mentions of terms
    1.  Test-Cases
    2.  [Test-Case-2][1]
    3.  Test-Case-3
    4.  [Test-Case-4][2]
    5.  Test-Case-5
-   THEN
    1.  Test-Cases MUST NOT have been linked
    2.  AND [Test-Case-2][1] MUST have been linked
    3.  AND Test-Case-3 MUST NOT have been linked
    4.  AND [Test-Case-4][2] MUST have been linked
    5.  AND Test-Case-5 MUST NOT have been linked

[1]: ./glossary.md#test-case-2 "Text"

[2]: ./glossary.md#test-case-4 "Text"
