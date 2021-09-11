# Tests for pattern-based lists

## Test Case

GIVEN a paragraph
AND a listOf configuration
AND text containing "Test Case: 1" which matches a listOf-pattern
THEN the system MUST insert an HTML element
AND MUST insert the HTML in front of the whole paragraph
AND generate a list WITH a single list item
AND the list item label MUST be the part which matches the pattern, only.

GIVEN a paragraph
AND a listOf configuration
AND text containing "Test Case: 1" which matches a listOf-pattern
AND text containing "Test Case: 1" twice
THEN the system MUST insert an HTML element only once
AND MUST insert the HTML in front of the whole paragraph
AND generate a list WITH a single list item
AND the list item label MUST be the part which matches the pattern, only.
