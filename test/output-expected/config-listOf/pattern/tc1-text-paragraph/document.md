# [Tests for pattern-based lists](#tests-for-pattern-based-lists)

## [Test Case](#test-case)

<span id="test-case-1" class="test" title="Test Case: 1"></span>

GIVEN a paragraph
AND a listOf configuration
AND text containing "Test Case: 1" which matches a listOf-pattern
THEN the system MUST insert an HTML element
AND MUST insert the HTML in front of the whole paragraph
AND generate a list WITH a single list item
AND the list item label MUST be the part which matches the pattern, only.

<span id="test-case-1-1" class="test" title="Test Case: 1"></span>

GIVEN a paragraph
AND a listOf configuration
AND text containing "Test Case: 1" which matches a listOf-pattern
AND text containing "Test Case: 1" twice
THEN the system MUST insert an HTML element only once
AND MUST insert the HTML in front of the whole paragraph
AND generate a list WITH a single list item
AND the list item label MUST be the part which matches the pattern, only.
