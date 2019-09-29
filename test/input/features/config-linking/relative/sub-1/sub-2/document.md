GIVEN option 'linking: relative'
AND option 'baseUrl: ${baseUrl}'
THEN term 'First-Level-Parent' MUST be linked by a relative path '../glossary.md#first-level-parent'
AND 'baseUrl' MUST NOT affect the result.

GIVEN option 'linking: relative'
AND option 'baseUrl: ${baseUrl}'
THEN term 'Second-Level-Parent' MUST be linked by a relative path '../../glossary.md#second-level-parent'
AND 'baseUrl' MUST NOT affect the result.
