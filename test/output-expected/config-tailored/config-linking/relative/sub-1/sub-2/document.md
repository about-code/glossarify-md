GIVEN option 'linking: relative'
AND option 'baseUrl: ${baseUrl}'
THEN term '[First-Level-Parent][1]' MUST be linked by a relative path '../glossary.md#first-level-parent'
AND 'baseUrl' MUST NOT affect the result.

GIVEN option 'linking: relative'
AND option 'baseUrl: ${baseUrl}'
THEN term '[Second-Level-Parent][2]' MUST be linked by a relative path '../../glossary.md#second-level-parent'
AND 'baseUrl' MUST NOT affect the result.

[1]: ../glossary.md#first-level-parent "must be referred to in './sub-2/document.md' with '../glossary.md#first-level-parent'"

[2]: ../../glossary.md#second-level-parent "must be referred to in './sub-1/sub-2/document.md' with '../../glossary.md#second-level-parent'"
