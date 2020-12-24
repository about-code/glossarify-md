# Testing option `linking.headingDepths`

## Linking Headings of Depth 2 and 4

- GIVEN a configuration
    ~~~json
    {
        "indexing": {
            "headingDepths": [1,2,3,4,5,6] // configured but currently also default
        },
        "linking": {
            "headingDepths": [2,4] // test-case
        }
    }
    ~~~
- AND mentions of terms
  1. Test-Case-1
  1. Test-Case-2
  1. Test-Case-3
  1. Test-Case-4
  1. Test-Case-5
  1. Test-Case-6
- THEN
  1. Test-Case-1 MUST NOT have been linked
  1. AND Test-Case-2 MUST have been linked
  1. AND Test-Case-3 MUST NOT have been linked
  1. AND Test-Case-4 MUST have been linked
  1. AND Test-Case-5 MUST NOT have been linked
  1. AND Test-Case-6 MUST NOT have been linked
