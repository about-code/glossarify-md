# [Document](#document)

GIVEN a configuration

```json
{
  "linking": {
    "paths": "relative",
    "pathComponents": ["path", "file", "ext"]
  },
  "generateFiles": {
    "listOfTables": {
      "file": "./tables.md"
    },
    "listOfFigures": {
      "file": "./figures.md"
    },
    "listOf": [{
      "class": "foo",
      "file": "./foo.md"
    }]
  },
}
```

## [Term Links](#term-links)

...WITH this document mentioning glossary term *[Term][1]*
THEN the term must be linked
AND the link url MUST be `../glossary.md#Term`

## [List Of Tables](#list-of-tables)

...WITH a configuration `listOfTable`
AND and a table

*A table:*

<a id="a-table" class="table" title="A table" />

| Head 1 | Head 2 |
| ------ | ------ |
| Item 1 | Item 2 |

THEN a file `./tables.md` MUST be generated
AND there MUST be a list item with caption *A table:*
AND the list item must be linked
AND the link MUST be `./sub-1/document.md#a-table`.

## [List Of Figures](#list-of-figures)

...WITH a configuration `listOfFigure`
AND and a figure <a id="my-figure" class="figure" title="My Figure"></a>![My Figure][2]
THEN a file `./figures.md` MUST be generated
AND there MUST be a list item with caption *My Figure*
AND the list item must be linked
AND the link MUST be `./sub-1/document.md#my-figure`.

## [List Of Foo](#list-of-foo)

...WITH a configuration `listOfFigure`
AND and a <span id="foo-bar">Foo</span>
THEN a file `./foo.md` MUST be generated
AND there MUST be a list item with caption *Foo*
AND the list item must be linked
AND the link MUST be `./sub-1/document.md#foo-bar`.

[1]: ../glossary.md#term "Term definition."

[2]: ./not-found.png
