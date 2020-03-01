## [TestCase: `class`-Attribute](#testcase-class-attribute)

GIVEN a configuration

```json
"generateFiles": {
    "indexing": { "groupByHeadingDepth": 0 },
    "listOf": [{
        "class": "class-attr",
        "file": "./list-of-class-attr.md",
        "title": "Test Case: List of 'class-attr'"
    }]
}
```

AND a document _./document-class-attr.md_

WITH

<a class="class-attr" id="a" title="Title Class-Attr A">Anchor A</a>

```md
<a class="class-attr" id="a" title="Title Class-Attr A">Anchor A</a>
```

AND WITH

<a class="class-attr" id="b" title="Title Class-Attr B">Anchor B</a>

```md
<a class="class-attr" id="b" title="Title Class-Attr B">Anchor B</a>
```

THEN a file `./list-of-class-attr.md` MUST be generated

WITH a document title

```md
# Test Case: List of 'class-attr'
```

AND WITH a list of two list items WHERE both items being links OR link-references similar to:

```md
- [Title Class-Attr A](./document-class-attr.md#a)
- [Title Class-Attr B](./document-class-attr.md#b)
```
