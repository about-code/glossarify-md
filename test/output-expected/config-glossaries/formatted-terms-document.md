# [Document](#document)

Related issue: #82

## [Mentions terms with glossary headings formatted](#mentions-terms-with-glossary-headings-formatted)

GIVEN a term '[codespan-format][1]' whose glossary heading is formatted
THEN the term MUST still be linked, correctly

GIVEN a term '[italic-format][2]' whose glossary heading is formatted
THEN the term MUST still be linked, correctly

GIVEN a term '[bold-format][3]' whose glossary heading is formatted
THEN the term MUST still be linked, correctly

Given a term [In parts formatted][4] whose heading is formatted, partly
THEN occurrences of the whole phrase
AND only the whole phrase MUST still be linked, correctly

GIVEN a term '[dense-definition][5]' whose term heading being formatted
AND being followed by a description without an intermediate empty line.
THEN term, short and long description MUST still be extracted, correctly.

GIVEN a term '[dense-definition-with-alias][6]' whose term heading being formatted
AND being followed by HTML aliases
AND being followed by a description all without an intermediate empty line.
THEN occurrences of the term must still be linked, correctly.

GIVEN a term '[#Hashtag][7]' THEN the term MUST still be linked correctly

[1]: ./formatted-terms-glossary.md#codespan-format "GIVEN a term heading being codespan formatted
THEN term occurrences in the document must still be linked, correctly"

[2]: ./formatted-terms-glossary.md#italic-format "GIVEN a term heading being italic formatted
THEN term occurrences in the document must still be linked, correctly"

[3]: ./formatted-terms-glossary.md#bold-format "GIVEN a term heading being bold formatted
THEN term occurrences in the document must still be linked, correctly"

[4]: ./formatted-terms-glossary.md#in-parts-formatted "Given a term heading being in parts formatted
THEN occurrences of the whole phrase in the document must still be linked, correctly"

[5]: ./formatted-terms-glossary.md#dense-definition "GIVEN a term heading being formatted
AND being followed by a description without an intermediate empty line."

[6]: ./formatted-terms-glossary.md#dense-definition-with-alias "GIVEN a term heading being formatted
AND being followed by HTML aliases
AND being followed by a description all without an intermediate empty line."

[7]: ./formatted-terms-glossary.md#hashtag "GIVEN a term definition with a hashtag
THEN term occurrences in the document must still be linked, correctly"
