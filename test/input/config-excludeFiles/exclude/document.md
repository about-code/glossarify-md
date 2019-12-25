GIVEN option 'excludeFiles' WITH pattern '**/*exclude*/**
AND this file being part of a folder 'exclude' matching the pattern
THEN term 'Term' MUST NOT be linked to its definition
AND this document MUST NOT exist in 'output-actual' or 'output-expected'.
