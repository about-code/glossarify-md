GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term '[Sibling][1]' MUST be linked by an absolute URL '${baseUrl}/glossary.md#absolute'

GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term '[First-Level-Child][2]' MUST be linked by an absolute URL '${baseUrl}/sub-1/glossary.md#first-level-child'

[1]: http://localhost/glossary.md#sibling "must be referred to in './document.md' with '${baseUrl}/glossary.md#sibling'"

[2]: http://localhost/sub-1/glossary.md#first-level-child "must be referred to in '../document.md' with '${baseUrl}/sub-1/glossary.md#first-leve-child'"
