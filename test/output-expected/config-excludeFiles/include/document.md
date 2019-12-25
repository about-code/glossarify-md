GIVEN option 'excludeFiles' WITH pattern `**/*exclude*/**`
AND this file being part of a folder 'include' not matching the pattern
THEN term '[Term][1]' must be linked to its definition
AND this document MUST exist in 'output-actual' AND 'output-expected'.

[1]: ../glossary.md#term "must not be referred to by excluded files."
