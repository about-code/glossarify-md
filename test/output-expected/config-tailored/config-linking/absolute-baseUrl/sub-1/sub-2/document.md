GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term '[First-Level-Parent][1]' MUST be linked by an absolute URL '${baseUrl}/sub-1/glossary.md#first-level-parent'

GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term '[Second-Level-Parent][2]' MUST be linked by an absolute URL '${baseUrl}/glossary.md#second-level-parent'

[1]: http://localhost/sub-1/glossary.md#first-level-parent

[2]: http://localhost/glossary.md#second-level-parent
