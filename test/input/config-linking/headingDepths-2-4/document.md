# Testing option `linking.headingDepths`

## Linking Headings of Depth 2 and 4

- GIVEN a configuration
    ~~~json
    {
        "linking": {
            "headingDepths": [2,4]
        }
    }
    ~~~
- AND mentions of terms
  1. Test-Cases
  1. Test-Case-2
  1. Test-Case-3
  1. Test-Case-4
  1. Test-Case-5
- THEN
  1. Test-Cases MUST NOT have been linked
  1. AND Test-Case-2 MUST have been linked
  1. AND Test-Case-3 MUST NOT have been linked
  1. AND Test-Case-4 MUST have been linked
  1. AND Test-Case-5 MUST NOT have been linked
