GIVEN a configuration

```json
"generateFiles": {
    "indexing": { "groupByHeadingDepth": 0 },
    "listOf": [{
        "class": "label",
        "file": "./list-of-label.md",
        "title": "Test Suite: Infer Labels"
    }]
}
```

AND a document _./document-infer-label.md_

<!-- This anchor belongs to test case A but must be placed before headline -->

<a id="label"></a>

## [Test Case A: No 'title', no 'text', no prior heading and 'id' prefix only\*\*](#test-case-a-no-title-no-text-no-prior-heading-and-id-prefix-only)

GIVEN anchor without a headline preceding the anchor

```md
<a id="label"></a>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference taking the file name of the anchor

```md
- [./document-infer-label.md](./document-infer-label.md)
```

## [Test Case B: No `title`, no `innerText`](#test-case-b-no-title-no-innertext)

GIVEN anchor <a id="label-test-Case-B:-Label-from-'id'"></a>

```md
<a id="label-test-Case-B:-Label-from-'id'"></a>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference
AND WITH a label derived from the id but WITHOUT the prefix
AND WITH hyphens replaced by spaces
AND WITH the first letter uppercased:

```md
- [Test Case B: Label from 'id'](./document-infer-label.md#label-test-Case-B:-Label-from-%27id%27)
```

## [Test Case C: No `title` but `innerText`](#test-case-c-no-title-but-innertext)

GIVEN anchor <a id="label-no-title-but-text">Test Case C: 'innerText'</a>

```md
<a id="label-no-title-but-text">Test Case C: 'innerText'</a>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case C: 'innerText'](./document-infer-label.md#label-no-title-but-text)
```

## [Test Case D: `title` but no `innerText`](#test-case-d-title-but-no-innertext)

GIVEN anchor <a id="label-title-but-no-text" title="Test Case D: 'title'"></a>

```md
<a id="label-title-but-no-text" title="Test Case D: 'title'"></a>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case D: 'title'](./document-infer-label.md#label-title-but-no-text)
```

## [Test Case E: `title` and `innerText`](#test-case-e-title-and-innertext)

GIVEN anchor <a id="label-title-and-text" title="Test Case E: 'title'">Test Case E: 'innerText'</a>

```md
<a id="label-title-and-text" title="Test Case E: 'title'">Test Case E: 'innerText'</a>
```

a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case E: 'title'](./document-infer-label.md#label-title-and-text)
```

WHERE "title" attribute took precedence over inner text.

## [Test Case F: Partly formatted `innerText`](#test-case-f-partly-formatted-innertext)

GIVEN anchor <a id="label-partly-formatted-text">Test Case F: Partly `formatted` innerText</a>

```md
<a id="label-partly-formatted-text">Test Case F: Partly `formatted` innerText</a>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case F: Partly formatted innerText](./document-infer-label.md#label-partly-formatted-text)
```

## [Test Case G: Fully formatted `innerText`](#test-case-g-fully-formatted-innertext)

GIVEN anchor <a id="label-fully-formatted-text">_Test Case G: Fully formatted innerText_</a>

```md
<a id="label-fully-formatted-text">*Test Case G: Fully formatted innerText*</a>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case G: Fully formatted innerText](./document-infer-label.md#label-fully-formatted-text)
```

## [Test Case H: InnerText from cite HTML element](#test-case-h-innertext-from-cite-html-element)

GIVEN HTML element <cite id="label-cite-element">Test Case H: Cite HTML element</cite>

```md
<cite id="label-cite-element">Test Case H: Cite HTML element</cite>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case H: Cite HTML element](./document-infer-label.md#label-cite-element)
```

AND **it can be observed that Browser-Scroll-To-Target DOES NOT work on GitHub**

## [Test Case I: InnerText from figure HTML element](#test-case-i-innertext-from-figure-html-element)

GIVEN HTML element <figure id="label-figure-element">Test Case I: Figure HTML element</figure>

```md
<figure id="label-figure-element">Test Case I: Figure HTML element</figure>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case I: Figure HTML element](./document-infer-label.md#label-figure-element)
```

AND **it can be observed that Browser-Scroll-To-Target DOES NOT work on GitHub**

## [Test Case J: InnerText from span HTML element](#test-case-j-innertext-from-span-html-element)

GIVEN HTML element <span id="label-span-element">Test Case J: Span HTML element</figure>

```md
<span id="label-span-element">Test Case J: Span HTML element</span>
```

THEN a file `./list-of-label.md` MUST be generated
WITH a list item being a link OR link-reference similar to:

```md
- [Test Case J: Span HTML element](./document-infer-label.md#label-span-element)
```

AND **it can be observed that Browser-Scroll-To-Target DOES work on GitHub**
