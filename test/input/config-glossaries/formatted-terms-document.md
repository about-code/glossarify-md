# Document

Related issue: #82

## Mentions terms with glossary headings formatted

GIVEN a term 'codespan-format' whose glossary heading is formatted
THEN the term MUST still be linked, correctly

GIVEN a term 'italic-format' whose glossary heading is formatted
THEN the term MUST still be linked, correctly

GIVEN a term 'bold-format' whose glossary heading is formatted
THEN the term MUST still be linked, correctly

Given a term In parts formatted whose heading is formatted, partly
THEN occurrences of the whole phrase
AND only the whole phrase MUST still be linked, correctly

GIVEN a term 'dense-definition' whose term heading being formatted
AND being followed by a description without an intermediate empty line.
THEN term, short and long description MUST still be extracted, correctly.

GIVEN a term 'dense-definition-with-alias' whose term heading being formatted
AND being followed by HTML aliases
AND being followed by a description all without an intermediate empty line.
THEN occurrences of the term must still be linked, correctly.

GIVEN a term '#Hashtag' THEN the term MUST still be linked correctly
