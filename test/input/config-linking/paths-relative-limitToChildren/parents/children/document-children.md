# Child

GIVEN a grandparent glossary `../../glossary-grandparents.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Grandparents from the grandparent glossary
THEN the term MUST be linked.

GIVEN a parent glossary `../glossary-parents.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Parents from the parent glossary
THEN the term MUST be linked.

GIVEN a sibling glossary `./glossary-siblings.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Siblings from the sibling glossary
THEN the term MUST be linked.

GIVEN a grandchild glossary `./grandchildren/glossary-grandchildren.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Grandchildren from the child glossary
THEN the term MUST be linked.

GIVEN a stepchild glossary `../stepchildren/glossary-stepchildren.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Stepchildren from the stepchild glossary
THEN the term MUST NOT be linked.

GIVEN an aunt glossary `../../aunts/glossary-aunts.md`
AND a config option `linking.limitByAncestry: true`
AND a child document mentioning term Aunts from the aunt glossary
THEN the term MUST NOT be linked.
