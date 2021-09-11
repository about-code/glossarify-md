# [Tests for pattern-based lists](#tests-for-pattern-based-lists)

## [Test Case](#test-case)

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

### [Quotes](#quotes)

GIVEN above configuration

<span id="text-with-quotes" class="test-quotes" title="Text with quotes"></span>

AND a paragraph 1 matching Text with "quotes"

<span id="text-with-quotes-1" class="test-quotes" title="Text with quotes"></span>

AND a paragraph 2 matching Text with ""quotes"

<span id="text-with-quotes-2" class="test-quotes" title="Text with quotes"></span>

AND a paragraph 3 matching Text with quotes""

<span id="text-with-quotes-3" class="test-quotes" title="Text with quotes"></span>

AND a paragraph 4 matching Text with ""quotes""

THEN the system MUST NOT produce a prematurely terminated HTML attribute for any of them.

### [Angle Brackets](#angle-brackets)

Given above configuration

<span id="text-with-angle-bra" class="test-angle-brackets" title="Text with angle brackets"></span>

AND a paragraph 1 matching Text with >angle brackets

<span id="text-with-angle-brac" class="test-angle-brackets" title="Text with angle brackets"></span>

AND a paragraph 2 matching Text with angle brackets>

<span id="text-with-angle-br" class="test-angle-brackets" title="Text with angle brackets"></span>

AND a paragraph 3 matching Text with <>angle brackets<>

<span id="text-with-angle-br-1" class="test-angle-brackets" title="Text with angle brackets"></span>

AND a paragraph 4 matching Text with >>angle brackets>>

<span id="text-with-angle-brac-1" class="test-angle-brackets" title="Text with angle brackets"></span>

AND a paragraph 5 matching Text with angle brackets>

THEN the system MUST NOT produce a prematurely terminated HTML element for any of them.

### [Trying to terminate RegExp](#trying-to-terminate-regexp)

Given above configuration

<span id="scriptwindowa" class="test-regexp" title="^$scriptwindow.alert()/script\ndangerous code"></span>

AND a paragraph 1 match RegExp with ^$"><script>window\.alert()</script>\ndangerous code
