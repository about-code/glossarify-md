GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term 'Sibling' MUST be linked by an absolute URL '${baseUrl}/glossary.md#absolute'

GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term 'First-Level-Child' MUST be linked by an absolute URL '${baseUrl}/sub-1/glossary.md#first-level-child'
