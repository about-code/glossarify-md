# Child

GIVEN a grandparent glossary `../../glossary-grandparents.md`
AND a config option `linking.limitByAncestry: true`
AND a stepchild document mentioning term Grandparents from the grandparent glossary
THEN the term MUST be linked.

GIVEN a parent glossary `../glossary-parents.md`
AND a config option `linking.limitByAncestry: true`
AND a stepchild document mentioning term Parents from the parent glossary
THEN the term MUST be linked.

GIVEN a grandchild glossary `../children/grandchildren/glossary-grandchildren.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Grandchildren from the child glossary
THEN the term MUST NOT be linked.

GIVEN a child glossary `../children/glossary-children.md`
AND a config option `linking.limitByAncestry: true`
AND a stepchild document mentioning term Children from the child glossary
THEN the term MUST NOT be linked.

GIVEN an aunt glossary `../../aunts/glossary-aunts.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Aunts from the aunt glossary
THEN the term MUST NOT be linked.
