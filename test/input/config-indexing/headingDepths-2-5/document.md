# Testing option `linking.headingDepths`

- GIVEN a configuration...

  ~~~json
  {
      "indexing": {
          "headingDepths": [2,5] // test-case
      },
      "linking": {
        "headingDepths": [2,3,4,5,6] // configured but currently also default
      }
  }
  ~~~

## 1: Term-Based Auto-Linking

- ...AND mentions of terms
  1. `"Test-Case-1-1"`
  1. `"Test-Case-1-2"`
  1. `"Test-Case-1-3"`
  1. `"Test-Case-1-4"`
  1. `"Test-Case-1-5"`
  1. `"Test-Case-1-6"`
- THEN
  1. Test-Case-1-1 MUST NOT have been linked
  1. AND Test-Case-1-2 MUST have been linked
  1. AND Test-Case-1-3 MUST NOT have been linked
  1. AND Test-Case-1-4 MUST NOT have been linked
  1. AND Test-Case-1-5 MUST have been linked
  1. AND Test-Case-1-6 MUST NOT have been linked

## 2: Id-Based Cross-Linking

- ...AND links with heading-ids
  1. `[tc-2-1](#tc-2-1)`
  1. `[tc-2-2](#tc-2-2)`
  1. `[tc-2-3](#tc-2-3)`
  1. `[tc-2-4](#tc-2-4)`
  1. `[tc-2-5](#tc-2-5)`
  1. `[tc-2-6](#tc-2-6)`
- THEN
  1. the path for [#tc-2-1](#tc-2-1) MUST NOT have been *resolved*
  1. AND the path for [#tc-2-2](#tc-2-2) MUST have been *resolved*
  1. AND the path for [#tc-2-3](#tc-2-3) MUST NOT have been *resolved*
  1. AND the path for [#tc-2-4](#tc-2-4) MUST NOT have been *resolved*
  1. AND the path for [#tc-2-5](#tc-2-5) MUST have been *resolved*
  1. AND the path for [#tc-2-6](#tc-2-6) MUST NOT have been *resolved*
