# [Glossary](#glossary)

## [Self](#self)

## [Children](#children)

Children are being made by parents.

# [Document](#document)

GIVEN a config...

```json
{
  "glossaries": [{
    "file": "./**/*.md"
  }],
  "linking": {
    "paths": "relative",
    "limitByTermOrigin": [ "parent-sibling" ]
  }
}
```

... assuming every document being a glossary...

## [Test Case 0](#test-case-0)

... AND a term *Self* defined in *this* glossary
THEN the term MUST NOT be linked.

## [Test Case 1](#test-case-1)

... AND a glossary `../../glossary-grandparents.md`
AND this document mentioning term *Grandparents* from the grandparent glossary
THEN the term MUST NOT be linked.

## [Test Case 2](#test-case-2)

... AND a glossary `../glossary-parents.md`
AND this document mentioning term *Parents* from the parent glossary
THEN the term MUST NOT be linked.

## [Test Case 3](#test-case-3)

... AND a glossary `./glossary-siblings.md`
AND this document mentioning term *Siblings* from the sibling glossary
THEN the term MUST NOT be linked.

## [Test Case 4](#test-case-4)

... AND a glossary `./grandchildren/glossary-grandchildren.md`
AND this document mentioning term *Grandchildren* from the child glossary
THEN the term MUST NOT be linked.

## [Test Case 5](#test-case-5)

... AND a glossary `../stepchildren/glossary-stepchildren.md`
AND this document mentioning term *[Stepchildren][1]* from the stepchild glossary
THEN the term MUST be linked.

## [Test Case 6](#test-case-6)

... AND a glossary `../../aunts/glossary-aunts.md`
AND this document mentioning term *[Aunts][2]* from the aunt glossary
THEN the term MUST be linked.

[1]: ../stepchildren/glossary-stepchildren.md#stepchildren "Stepchildren are children adopted by their parents."

[2]: ../../aunts/glossary-aunts.md#aunts "The aunts of a person are sisters of the person's parents."
