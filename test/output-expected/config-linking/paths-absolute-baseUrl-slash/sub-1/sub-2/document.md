GIVEN option `"linking": "absolute"`
AND option `"baseUrl": "/"`
THEN term '[First-Level-Parent][1]' MUST be linked by an absolute URL `/sub-1/glossary.md#first-level-parent`

GIVEN option `"linking": "absolute"`
AND option `"baseUrl": "/"`
THEN term '[Second-Level-Parent][2]' MUST be linked by an absolute URL `/glossary.md#second-level-parent`

[1]: /sub-1/glossary.md#first-level-parent "must be referred to in './sub-2/document.md' with /sub-1/glossary.md#first-level-parent"

[2]: /glossary.md#second-level-parent "must be referred to in './sub-1/sub-2/document.md' with /glossary.md#second-level-parent"
