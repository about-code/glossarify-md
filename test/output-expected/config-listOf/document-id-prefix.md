# [Document](#document)

## [TestCase: `id`-prefix](#testcase-id-prefix)

GIVEN a configuration

```json
"generateFiles": {
    "indexing": { "groupByHeadingDepth": 0 },
    "listOf": [{
        "class": "prefix",
        "file": "./list-of-prefix.md",
        "title": "Test Case: List of 'prefix'"
    }]
}
```

AND a document _./document-id-prefix.md_

WITH <a id="prefix-a" title="Title Prefix A">Anchor A</a>

```md
<a id="prefix-a" title="Title Prefix A">Anchor A</a>
```

AND WITH <a id="prefix-b" title="Title Prefix B">Anchor B</a>

```md
<a id="prefix-b" title="Title Prefix B">Anchor B</a>
```

THEN a file `./list-of-prefix.md` MUST be generated

WITH a document title

```md
# Test Case: List of 'prefix'
```

AND WITH a list of two list items WHERE both items being links OR link-references similar to

```md
- [Title Prefix A](./document-id-prefix.md#prefix-a)
- [Title Prefix B](./document-id-prefix.md#prefix-b)
```
