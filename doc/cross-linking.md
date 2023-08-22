# [Cross-Linking](#cross-linking)

[pandoc-heading-ids]: https://pandoc.org/MANUAL.html#heading-identifiers

[CommonMark]: https://commonmark.org

[doc-ambiguity]: ./ambiguities.md

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

Such a [configuration][4] makes glossarify-md consider every `*.md` file a *glossary* and each of its section headings *terms*. Mentioning headings (or their aliases) in any of the processed files turns the phrases into links to those section headings.

> **ⓘ** When the `glossaries` option has multiple `file` patterns and the file sets covered by those patterns overlap then for a file that would belong to multiple file sets only the entry *latest* in the config array applies. Also see [Multiple Glossaries and Ambiguity][doc-ambiguity] for ways to handle term ambiguity in these cases.

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

When there are two or more term definitions or book sections with the same heading phrase then you might want to refer to a particular term definition or section. While we would recommend trying [Term-based Auto-Linking][1] with distinguished *aliases*, first, there might be situations where you might want to be explicit about a link target. With glossarify-md you can use [pandoc's concept of heading identifiers][pandoc-heading-ids] for identifier-based cross linking.

> **ⓘ Note:** Pandoc's identifier syntax is not standardized in [CommonMark].

**Example: [Identifier-based Cross-Linking][5]**

*./page1.md*

```md
## User Story {#s-241}
```

The document declares a heading-id `#s-241`. Given it is **unique across *all* files** being processed then you can use it as a link reference in any of these files:

```md
[any phrase](#s-241)
```

glossarify-md will resolve the actual path to the corresponding section heading for you (relative or absolute, depending on the `paths` [config option][4]):

*./pages/page2.md*

    [any phrase](../page1.md#s-241)

## [Tree-Scoped Linking](#tree-scoped-linking)

Tree Scoped Linking can be used to restrict Term-Based Linking to link targets within particular branches of a file tree and prevent links across branches. It can also be used as a [disambiguation tactic][doc-ambiguity] when a book project's filesystem structure reflects chapters and sections of a [Table of Contents][6] *or* individual topics, at least. Then when there were a term with different meanings *in particular branches of the filesystem tree* then you could create a glossary for each of these branches and put the term definition applicable in a branch in the glossary for that branch.

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

A term's *origin* is the glossary section where the term was defined. A link is a directed edge of kind `(term-occurrence) -> (term-origin)`. A [configuration][4]...

```json
"limitByTermOrigin": ["parent", "sibling", "self"]
```

...linkifies term occurrences when the term origin is found

*   in the same file (`"self"`),
*   a sibling file within the same directory (`"sibling"`)
*   or a file in a direct parent directory (`"parent"`; bottom up linking)

Given above example, the config then

*   *does* link term occurrences with term definitions in the same file
*   *does* link term occurrences in `context-1-1` with terms defined in `context-1` or context root `/`
*   *does not* link term occurrences in context root `/` or `context-1` with terms defined in `context-1-1`
*   *does not* link term occurrences in `context-1-1` with terms defined in `context-1-2` or `context-2`

```json
"limitByTermOrigin": ["children", "sibling", "self"]
```

...linkifies term occurrences only when the term was defined in the same file a file in the same directory or a file in a subdirectory (top down linking),

```json
"limitByTermOrigin": ["parent", "children", "sibling", "self"]
```

...linkifies term occurrences in both directions along a filesystem path. Yet, it does not create links between branches of the file tree, e.g. it does not link terms defined in `context-1-2` with term occurrences found in `context-1-1` and vice versa,

```json
"limitByTermOrigin": ["parent", "children", "sibling", "parent-sibling", "self"]
```

...linkifies any term definitions with any term occurrences, including linking accross tree branches (bidirectionally). This is basically the "unlimited" default so is equivalent to `limitByTermOrigin: []`.

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#term-based-auto-linking "Term-based auto-linking is to assume headings in markdown files called glossaries are terms."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#cross-linking "ⓘ Since: v5.0.0"

[3]: https://github.com/isaacs/node-glob#glob-primer "A file pattern matcher."

[4]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[5]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#identifier-based-cross-linking "When there are two or more term definitions or book sections with the same heading phrase then you might want to refer to a particular term definition or section."

[6]: https://github.com/about-code/glossarify-md/blob/master/README.md

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#tree-scoped-linking "Tree Scoped Linking can be used to restrict Term-Based Linking to link targets within particular branches of a file tree and prevent links across branches."
