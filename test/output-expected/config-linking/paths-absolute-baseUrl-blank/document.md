GIVEN option `"linking": "absolute"`
AND option `"baseUrl": " "`
THEN term '[Sibling][1]' MUST be linked by an absolute URL `/glossary.md#absolute`

GIVEN option `"linking": "absolute"`
AND option `"baseUrl": " "`
THEN term '[First-Level-Child][2]' MUST be linked by an absolute URL `/sub-1/glossary.md#first-level-child`

[1]: /glossary.md#sibling "must be referred to in './document.md' with /glossary.md#sibling"

[2]: /sub-1/glossary.md#first-level-child "must be referred to in '../document.md' with /sub-1/glossary.md#first-leve-child"
