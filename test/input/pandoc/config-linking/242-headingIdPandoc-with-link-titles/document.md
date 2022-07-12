# Test

See https://github.com/about-code/glossarify-md/issues/242

## Test Case 1: Term-Based Auto-Linking

GIVEN a term *Test*
THEN the system MUST linkify *Test*
AND the link MUST have the term's *short description* as a link title.

## Test Case 2: Identifier-Based Cross-Linking

GIVEN a [specific link](#test-id) with a term's custom id
AND the Markdown author DOES NOT provide a link title on its own
THEN the system SHOULD add the term's *short description* as a link title.

## Test Case 3: Identifier-Based Cross-Linking with custom link title

GIVEN a [specific link](#test-id "Custom Link Title") with a term's custom id
AND the Markdown author DOES provide a custom link title on its own
THEN the system SHOULD keep "Custom Link Title" as the link title.
