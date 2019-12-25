# Testing option `excludeFiles`

GIVEN option 'excludeFiles' WITH pattern `excludeFile*`
AND this file having name 'excludeFile.md' matching the pattern
THEN term 'Term' MUST NOT be replaced
AND the file MUST NOT exist in 'output-expected'.
