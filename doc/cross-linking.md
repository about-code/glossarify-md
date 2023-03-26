# [Cross-Linking](#cross-linking)

[pandoc-heading-ids]: https://pandoc.org/MANUAL.html#heading-identifiers

> **ⓘ Since: v5.0.0**

## [Term-Based Auto-Linking](#term-based-auto-linking)

[Term-based auto-linking][1] is to assume headings in markdown files called *glossaries* are *terms*. Whenever being mentioned in text the terms are turned into a link to the glossary section where they have been defined. **Since v5.0.0** we have evolved that principle into a more generic means of [cross-linking][2] by supporting [glob 🌎][3] patterns in `glossaries.file`.

**Example:**

```json
{
   "glossaries": [
       { "file": "./**/*.md" }
   ]
}
```

Such a [configuration][4] makes [glossarify-md][5] consider every `*.md` file a *glossary* and each of its section headings *terms*. Mentioning headings (or their [aliases][6]) somewhere in the file turns the phrases into links to that section. You might want to have a look at `linking.*` config options or [Tree-scoped Linking][7] for ways to fine-tune [linkification][8].

> **ⓘ** When `glossaries:[]` has multiple `file` entries, each with a glob pattern and the file sets covered by those patterns overlap, then for a file that would be come part of both file sets (intersection) only the entry *latest* in the array applies.

<!--
**Too many links**: Try config options
  - `linking.headingDepths`
  - `linking.mentions`
  - `linking.limitByAlternatives`

**Ambiguities** caused by
  - terms declared in more than one glossary
  - or `glossaries.files` used with glob patterns matchin a large file set
  - or multiple glossary pages following a common page template

Try [identifier-based cross-linking](#identifier-based-cross-linking) and config options
  - `linking.limitByAlternatives`
  - `linking.limitByTermOrigin`

**Wrong or weak context**. Try [Tree-Scoped Linking](#tree-scoped-linking) with config option
  - `linking.limitByTermOrigin`
-->

## [Identifier-based Cross-Linking](#identifier-based-cross-linking)

When there are two or more [term][9] definitions or book sections with the same heading phrase, then you might want to refer to a particular term definition or section, in particular. While we would recommend trying [Term-based Auto-Linking][1] with distinguished *[aliases][6]*, first, there might be situations where you might want to be explicit about a link target. [glossarify-md][5] supports [pandoc's concept of heading identifiers][pandoc-heading-ids] for identifier-based cross linking.

> **ⓘ Note:** Pandoc's identifier syntax is not standardized in \[CommonMark].

**Example: [Identifier-based Cross-Linking][10]**

*./page1.md*

```md
## User Story {#s-241}
```

The document declares a heading-id `#s-241`. Given `#s-241` is ***unique* across all documents** then you can use it as a link reference in any file being processed...

```md
[any phrase](#s-241)
```

...and [glossarify-md][5] will resolve the actual path to the corresponding section heading for you (relative or absolute based on the `paths` [config option][4]):

*./pages/page2.md*

    [any phrase](../page1.md#s-241)

## [Tree-Scoped Linking](#tree-scoped-linking)

When using term-based auto linking then, occassionally, you might find [term][9] occurrences being linkified in contexts where a link to the respective link target doesn't seem right or even a bit misleading. A manual approach to prevent this in a case-by-case decision is to wrap a term into some HTML-like tag, e.g. `<x>term</x>`. *[Tree-scoped Linking][7]* uses [config option][4] `linking.limitByTermOrigin` to limit the applicable scope of a term definition to a subtree of a file tree and prevent links to other parts of the tree:

**Example: [Tree-Scoped Linking][7]**

*Project directory layout:*

    ${ROOT}
       |-context-1/
       |   |-context-1-1/
       |   |   |-document.md
       |   |   '-glossary.md
       |   |-context-1-2/
       |   |   |-document.md
       |   |   '-glossary.md
       |   '-glossary.md
       |
       |-context-2/
       |- ...
       '-glossary.md

*[Configuration][4]*

```json
{
  "glossaries": [
    {"file": "./**/*.md" }
  ],
  "linking": {
    "limitByTermOrigin": ["parent", "sibling", "self"]
  }
}
```

A [term][9]'s origin is the glossary section where the term was defined. A link is a directed edge of kind `(term-occurrence) -> (term-origin)`. So...

```json
"limitByTermOrigin": ["parent", "sibling", "self"]
```

...linkifies [term][9] occurrences when the term origin is found to be in the same file, a sibling file in same directory or a file in a direct parent directory (bottom up linking). Given above example, then

*   it *does* link [term][9] occurrences with term definitions in the same file
*   it *does* link [term][9] occurrences in `context-1-1` with terms defined in `context-1` or context root `/`
*   it *does not* link [term][9] occurrences in context root `/` or `context-1` with terms defined in `context-1-1`
*   it *does not* link [term][9] occurrences in `context-1-1` with terms defined in `context-1-2` or `context-2`

...and so forth,

```json
"limitByTermOrigin": ["children", "sibling", "self"]
```

...linkifies [term][9] occurrences only when the term was defined in the same file a file in the same directory or a file in a subdirectory (top down linking),

```json
"limitByTermOrigin": ["parent", "children", "sibling", "self"]
```

...linkifies [term][9] occurrences in both directions along a filesystem path. Yet, it does not create links between branches of the file tree, e.g. it does not link terms defined in `context-1-2` with term occurrences found in `context-1-1` and vice versa,

```json
limitByTermOrigin: ["parent", "children", "sibling", "parent-sibling", "self"]
```

...linkifies any [term][9] definitions with any term occurrences, including linking accross tree branches (bidirectionally). This is basically the "unlimited" default so is equivalent to `limitByTermOrigin: []`.

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#term-based-auto-linking "Term-based auto-linking is to assume headings in markdown files called glossaries are terms."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#cross-linking "ⓘ Since: v5.0.0"

[3]: https://github.com/isaacs/node-glob#glob-primer "A file pattern matcher."

[4]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[5]: https://github.com/about-code/glossarify-md

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/term-attributes.md#aliases "Expects a comma-separated string or a list of strings which provide synonyms or alternative spellings for a term that should be linked with a term definition when found in text."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#tree-scoped-linking "When using term-based auto linking then, occassionally, you might find term occurrences being linkified in contexts where a link to the respective link target doesn't seem right or even a bit misleading."

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#linkification "Process of searching for a term in document A matching a heading phrase in
document B and replacing the term in document A with a Markdown link pointing
onto the term definition in document B."

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term "Terms are headings in a markdown file which has been configured to be a glossary file."

[10]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#identifier-based-cross-linking "When there are two or more term definitions or book sections with the same heading phrase, then you might want to refer to a particular term definition or section, in particular."
