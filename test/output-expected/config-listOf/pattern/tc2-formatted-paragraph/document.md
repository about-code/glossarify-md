# [Tests for pattern-based lists](#tests-for-pattern-based-lists)

GIVEN a configuration

```md
{
   "generateFiles": {
       "listOf": [{
         "class": "test",
         "file": "list.md",
         "title": "Test Case",
         "pattern": "Test Case: [0-9]{1,3}"
       }]
   }
}
```

## [Test Case](#test-case)

<span id="test-case-2" class="test" title="Test Case: 2"></span>

GIVEN above configuration
AND this mdAst *text* node: "Test Case: 2"
THEN the system MUST prepend an HTML element WITH attributes

*   `id` whose value is a Slug limited to 20 characters in length
*   AND `title` whose value is the value of the text node
*   AND `class` whose value is `tc1`

## [Test Case 2](#test-case-2)

<span id="test-case-2-1" class="test" title="Test Case: 2"></span>

GIVEN above configuration
AND a paragraph with "Test *Case*: 2"
WITH parts of the text to be matched being emphasized
THEN the system MUST still match the phrase and ignore the formatting
AND generate a list item.
