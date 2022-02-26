# [Glossary](#glossary)

## [Self](#self)

## [Children](#children)

[Children][1] are being made by parents.

# [Document](#document)

GIVEN a config...

```json
{
  "glossaries": [{
    "file": "./**/*.md"
  }],
  "linking": {
  }
}
```

... assuming every document being a glossary...

## [Test Case 0](#test-case-0)

... AND a term *[Self][2]* defined in *this* glossary
THEN the term MUST be linked.

## [Test Case 1](#test-case-1)

... AND a glossary `../../glossary-grandparents.md`
AND this document mentioning term *[Grandparents][3]* from the grandparent glossary
THEN the term MUST be linked.

## [Test Case 2](#test-case-2)

... AND a glossary `../glossary-parents.md`
AND this document mentioning term *[Parents][4]* from the parent glossary
THEN the term MUST be linked.

## [Test Case 3](#test-case-3)

... AND a glossary `./glossary-siblings.md`
AND this document mentioning term *[Siblings][5]* from the sibling glossary
THEN the term MUST be linked.

## [Test Case 4](#test-case-4)

... AND a glossary `./grandchildren/glossary-grandchildren.md`
AND this document mentioning term *[Grandchildren][6]* from the child glossary
THEN the term MUST be linked.

## [Test Case 5](#test-case-5)

... AND a glossary `../stepchildren/glossary-stepchildren.md`
AND this document mentioning term *[Stepchildren][7]* from the stepchild glossary
THEN the term MUST be linked.

## [Test Case 6](#test-case-6)

... AND a glossary `../../aunts/glossary-aunts.md`
AND this document mentioning term *[Aunts][8]* from the aunt glossary
THEN the term MUST be linked.

[1]: #children "Children are being made by parents."

[2]: #self

[3]: ../../glossary-grandparents.md#grandparents "Grandparents of a child are the parents of a child's parents and aunts or uncles."

[4]: ../glossary-parents.md#parents "Parents of a person gave birth to that person."

[5]: ./glossary-siblings.md#siblings "Siblings of a person are the person's brothers or sisters."

[6]: ./grandchildren/glossary-grandchildren.md#grandchildren "Grandchildren are the children of children."

[7]: ../stepchildren/glossary-stepchildren.md#stepchildren "Stepchildren are children adopted by their parents."

[8]: ../../aunts/glossary-aunts.md#aunts "The aunts of a person are sisters of the person's parents."
