# Tests for pattern-based lists

## Test Case

GIVEN a configuration

```md
{
   "generateFiles": {
      "listOf": [
         {
            "class": "test-quotes",
            "file": "./list-quotes.md",
            "title": "Test Case",
            "pattern": "Text with [\"]*quotes[\"]*"
         },{
            "class": "test-angle-brackets",
            "file": "./list-angle-brackets.md",
            "title": "Test Case",
            "pattern": "Text with [<]*angle brackets[>]*"
         },{
            "class": "test-regexp",
            "file": "./list-regexp.md",
            "title": "Test Case",
            "pattern": "RegExp with (.*)"
         }
      ]
   }
}
```

### Quotes

GIVEN above configuration

AND a paragraph 1 matching Text with "quotes"

AND a paragraph 2 matching Text with ""quotes"

AND a paragraph 3 matching Text with quotes""

AND a paragraph 4 matching Text with "\"quotes"\"

THEN the system MUST NOT produce a prematurely terminated HTML attribute for any of them.

### Angle Brackets

Given above configuration

AND a paragraph 1 matching Text with >angle brackets

AND a paragraph 2 matching Text with angle brackets>

AND a paragraph 3 matching Text with <>angle brackets<>

AND a paragraph 4 matching Text with >>angle brackets>>

AND a paragraph 5 matching Text with angle brackets>

THEN the system MUST NOT produce a prematurely terminated HTML element for any of them.

### Trying to terminate RegExp

Given above configuration

AND a paragraph 1 match RegExp with ^$"><script>window.alert()</script>\ndangerous code
