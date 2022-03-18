# Glossary

## Self

## Children

Children are being made by parents.

# Document

GIVEN a config...

~~~json
{
  "glossaries": [{
    "file": "./**/*.md"
  }],
  "linking": {
    "paths": "relative",
    "limitByTermOrigin": [ "parent-sibling" ]
  }
}
~~~

... assuming every document being a glossary...

## Test Case 0
... AND a term *Self* defined in *this* glossary
THEN the term MUST NOT be linked.

## Test Case 1
... AND a glossary `../../glossary-grandparents.md`
AND this document mentioning term *Grandparents* from the grandparent glossary
THEN the term MUST NOT be linked.

## Test Case 2
... AND a glossary `../glossary-parents.md`
AND this document mentioning term *Parents* from the parent glossary
THEN the term MUST NOT be linked.

## Test Case 3
... AND a glossary `./glossary-siblings.md`
AND this document mentioning term *Siblings* from the sibling glossary
THEN the term MUST NOT be linked.

## Test Case 4
... AND a glossary `./grandchildren/glossary-grandchildren.md`
AND this document mentioning term *Grandchildren* from the child glossary
THEN the term MUST NOT be linked.

## Test Case 5
... AND a glossary `../stepchildren/glossary-stepchildren.md`
AND this document mentioning term *Stepchildren* from the stepchild glossary
THEN the term MUST be linked.

## Test Case 6
... AND a glossary `../../aunts/glossary-aunts.md`
AND this document mentioning term *Aunts* from the aunt glossary
THEN the term MUST be linked.
