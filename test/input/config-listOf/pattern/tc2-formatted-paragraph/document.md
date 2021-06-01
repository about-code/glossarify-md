# Tests for pattern-based lists

## Test Case

GIVEN a configuration
~~~md
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
~~~
AND this mdAst *text* node: "Test Case: 2"
THEN the system MUST prepend an HTML element WITH attributes
  - `id` whose value is a Slug limited to 20 characters in length
  - AND `title` whose value is the value of the text node
  - AND `class` whose value is `tc1`
