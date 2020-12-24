GIVEN option 'linking: relative'
AND option 'baseUrl: ${baseUrl}'
THEN term '[Sibling][1]' MUST be linked by a relative path 'glossary.md#sibling'
AND 'baseUrl' MUST NOT affect the result.

GIVEN option 'linking: relative'
AND option 'baseUrl: ${baseUrl}'
THEN term '[First-Level-Child][2]' MUST be linked by a relative path './sub-1/glossary.md#first-level-child'
AND 'baseUrl' MUST NOT affect the result.

[1]: ./glossary.md#sibling "must be referred to in './document.md' with 'glossary.md#sibling'"

[2]: ./sub-1/glossary.md#first-level-child "must be referred to in '../document.md' with './sub-1/glossary.md#first-level-child'"
