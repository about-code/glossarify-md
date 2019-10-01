GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term 'First-Level-Parent' MUST be linked by an absolute URL '${baseUrl}/sub-1/glossary.md#first-level-parent'

GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term 'Second-Level-Parent' MUST be linked by an absolute URL '${baseUrl}/glossary.md#second-level-parent'
