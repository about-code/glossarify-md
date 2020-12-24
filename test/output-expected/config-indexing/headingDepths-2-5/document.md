# [Testing option `linking.headingDepths`](#testing-option-linkingheadingdepths)

-   GIVEN a configuration...

    ```json
    {
        "indexing": {
            "headingDepths": [2,5] // test-case
        },
        "linking": {
          "headingDepths": [2,3,4,5,6] // configured but currently also default
        }
    }
    ```

## [1: Term-Based Auto-Linking](#1-term-based-auto-linking)

-   ...AND mentions of terms
    1.  `"Test-Case-1-1"`
    2.  `"Test-Case-1-2"`
    3.  `"Test-Case-1-3"`
    4.  `"Test-Case-1-4"`
    5.  `"Test-Case-1-5"`
    6.  `"Test-Case-1-6"`
-   THEN
    1.  Test-Case-1-1 MUST NOT have been linked
    2.  AND [Test-Case-1-2][1] MUST have been linked
    3.  AND Test-Case-1-3 MUST NOT have been linked
    4.  AND Test-Case-1-4 MUST NOT have been linked
    5.  AND [Test-Case-1-5][2] MUST have been linked
    6.  AND Test-Case-1-6 MUST NOT have been linked

## [2: Id-Based Cross-Linking](#2-id-based-cross-linking)

-   ...AND links with heading-ids
    1.  `[tc-2-1](#tc-2-1)`
    2.  `[tc-2-2](#tc-2-2)`
    3.  `[tc-2-3](#tc-2-3)`
    4.  `[tc-2-4](#tc-2-4)`
    5.  `[tc-2-5](#tc-2-5)`
    6.  `[tc-2-6](#tc-2-6)`
-   THEN
    1.  the path for [#tc-2-1][3] MUST NOT have been _resolved_
    2.  AND the path for [#tc-2-2][4] MUST have been _resolved_
    3.  AND the path for [#tc-2-3][5] MUST NOT have been _resolved_
    4.  AND the path for [#tc-2-4][6] MUST NOT have been _resolved_
    5.  AND the path for [#tc-2-5][7] MUST have been _resolved_
    6.  AND the path for [#tc-2-6][8] MUST NOT have been _resolved_

[1]: ./glossary.md#test-case-1-2 "MUST be linked by term-based auto-linking"

[2]: ./glossary.md#test-case-1-5 "MUST be linked by term-based auto-linking"

[3]: #tc-2-1

[4]: ./glossary.md#tc-2-2

[5]: #tc-2-3

[6]: #tc-2-4

[7]: ./glossary.md#tc-2-5

[8]: #tc-2-6
