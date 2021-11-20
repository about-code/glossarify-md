# glossarify-md

![Tests (Functional)](https://github.com/about-code/glossarify-md/workflows/Tests%20\(Functional\)/badge.svg)
![Nightly Tests (Latest Dependencies)](https://github.com/about-code/glossarify-md/workflows/Tests%20\(with%20latest%20deps\)/badge.svg)

[glossarify-md] is a command line tool to help Markdown writers with

- **Cross-Linking** (primary use case): autolink terms to some definition in a glossary
- **Indexes**: generate indexes from glossary terms and navigate to where they were mentioned
- **Lists**: generate arbitrary lists such as *List of Tables*, *List of Figures*, *List of Listings*, *List of Definitions*, *List of Formulas*, and so forth...

[vuepress] users might be interested in learning [how to use the tool with vuepress][doc-vuepress].

[doc-vocabulary-uris]: https://github.com/about-code/glossarify-md/blob/master/doc/vocabulary-uris.md

[doc-skos-interop]: https://github.com/about-code/glossarify-md/blob/master/doc/skos-interop.md

[doc-vuepress]: https://github.com/about-code/glossarify-md/blob/master/doc/vuepress.md

[doc-syntax-extensions]: https://github.com/about-code/glossarify-md/blob/master/doc/markdown-syntax-extensions.md

[doc-conceptual-layers]: https://github.com/about-code/glossarify-md/blob/master/doc/conceptual-layers.md

[CommonMark]: https://www.commonmark.org

[GFM]: https://github.github.com/gfm/

[glob]: https://github.com/isaacs/node-glob#glob-primer

[glossarify-md]: https://github.com/about-code/glossarify-md

[link reference definitions]: https://spec.commonmark.org/0.30/#link-reference-definition

[mdast]: https://github.com/syntax-tree/mdast

[micromark]: https://github.com/micromark/

[pandoc]: https://pandoc.org

[pandoc-heading-ids]: https://pandoc.org/MANUAL.html#heading-identifiers

[remark]: https://github.com/remarkjs/remark

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

[remark-plugins]: https://github.com/remarkjs/awesome-remark

[unified]: https://unifiedjs.com

[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

[vuepress]: https://vuepress.vuejs.org

## Table of Contents

- [Install](#install)
- [Configuration](#configuration)
  - [Config CLI](#config-cli)
- [Sample](#sample)
- [What's not Linked](#whats-not-linked)
- [Aliases and Synonyms](#aliases-and-synonyms)
- [Term Hints](#term-hints)
- [Multiple Glossaries](#multiple-glossaries)
- [Sorting your glossaries](#sorting-your-glossaries)
- [Cross Linking](#cross-linking)
  - [Term-Based Auto-Linking](#term-based-auto-linking)
  - [Identifier-based Cross-Linking](#identifier-based-cross-linking)
- [Generating Files](#generating-files)
  - [Book Index](#book-index)
  - [Lists](#lists)
  - [List of Figures](#list-of-figures)
  - [List of Tables](#list-of-tables)
  - [Lists from Regular Expressions](#lists-from-regular-expressions)
- [Structured Export and Import](#structured-export-and-import)
- [Node Support Matrix](#node-support-matrix)
- [Options](#options)
- [Special Thanks go to](#special-thanks-go-to)
- [License](#license)

## Install

#### Option 1: Install globally, init and run:

```
npm i -g glossarify-md

glossarify-md --init --new
glossarify-md --config ./glossarify-md.conf.json
```

#### Option 2: Install locally as a project dependency, init and run:

```
npm i glossarify-md

npx glossarify-md --local --init --new
npx glossarify-md --config ./glossarify-md.conf.json
```

... or add an npm-script to your `package.json`:

*package.json*

```json
{
  "scripts": {
    "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
  }
}
```

```
npm run glossarify
```

## Configuration

> **ⓘ Since v5.0.0**

Generate a configuration with the `--init` option:

```
npx glossarify-md --init > glossarify-md.conf.json
```

- use `--init` to write a minimal config to stdout
  - add `--new`  to write a config to `./glossarify-md.conf.json` and a glossary to `./docs/glossary.md`
  - add `--more` to write a config with more [options] and default values
  - add `--local` to load the config schema from the `node_modules` directory

*glossarify-md.conf.json (`glossarify-md --init`)*

```json
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v5.1.0/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
```

*glossarify-md.conf.json* (`glossarify-md --init --local`)

```json
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
```

> **Paths**
>
> 1. `baseDir` and `$schema` are resolved relative to the config file or current working directory (when passed via CLI)
> 1. all other paths  are resolved relative to `baseDir`
> 1. `outDir` *must not* be in `baseDir`so, if relative, must step out of `baseDir`

### Config CLI

> **ⓘ Since v4.0.0**

Use `--shallow` or `--deep`

1. to provide a configuration solely via command line
1. to merge a configuration with a config file

*Example: use `--shallow` to *replace* simple top-level options:*

```
glossarify-md
  --config ./glossarify-md.conf.json
  --shallow "{ 'baseDir':'./docs', 'outDir':'../target' }"
```

*Example: use `--shallow` to *replace* nested object-like options like `glossaries` alltogether:*

```
glossarify-md
  --config ./glossarify-md.conf.json
  --shallow "{ 'glossaries': [{'file':'./replace.md'}] }"
```

*Example: use `--deep` to *extend* nested object-like options, e.g. to **add** another array item to `glossaries` in the config file write:*

```
glossarify-md
  --config ./glossarify-md.conf.json
  --deep "{'glossaries': [{'file':'./extend.md'}] }"
```

## Sample

[Sample]: #sample

We assume a sample project with the following structure:

```
${root}
   +- docs/
   |    +- pages/
   |    |    |- page1.md
   |    |    `- page2.md
   |    |
   |    |- README.md
   |    |- requirements.md
   |    `- glossary.md
   |
   +- docs-glossarified/  (Generated output directory)
   `- glossarify-md.conf.json
```

**Input**

Your original glossary is a file

*docs/glossary.md*

```md
# Glossary

## Term

A glossary term has a short description. The full description contains both sentences.
```

Your document files may just use the term *Term* anywhere in text:

*./docs/pages/page1.md...*

```md
# Demo

This is a text which uses a glossary Term to describe something.
```

Then run [glossarify-md] with a [glossarify-md.conf.json](#configuration):

```
npx glossarify-md --config ./glossarify-md.conf.json
```

**Output Results**

Augmented versions of the source files have been written to the output directory:

*./docs-glossarified/pages/page1.md*

```md
# [Demo](#demo)

This is a text which uses a glossary [Term🟉][1] to describe something.

[1]: ../glossary.md#term "A glossary term has a short description."
```

*Rendered as HTML:*

> ## [Demo](#demo)
>
> This is a text which uses a glossary [Term🟉][1] to describe something.
>
> [1]: #term "A glossary term has a short description."

Headings in glossary files have got an anchor ID and have been made linkable:

*./docs-glossarified/glossary.md*:

```md
# [Glossary](#glossary)

## [Term](#term)

A glossary term has a short description. The full description contains both sentences.
```

*Rendered as HTML*:

> ## [Glossary](#glossary)
>
> ### [Term](#term)
>
> A glossary term has a short description. The full description contains both sentences.

## What's not Linked

Some syntactic positions of a term occurrence are **excluded** from being linked to the glossary. Terms are not linkified when part of:

- Headlines `#`
- (Markdown) links `[]()`
- Preformatted blocks ` ```, ~~~ `
- Blockquotes `>`
- HTML `<a>text</a>`

> **ⓘ Tip:**  Wrap a word into `<span>word</span>` or some non-HTML tag like e.g. `<x>word</x>` to mark a word for exclusion from [term-based auto-linking][cross-linking].

> **ⓘ** Blockquotes are excluded based on the premise that a quoted entity may not share the same definition of a term like the entity who quotes it.

## Aliases and Synonyms

[alias]: #aliases-and-synonyms

[aliases]: #aliases-and-synonyms

[term-attributes]: #aliases-and-synonyms

Aliases can be added by what we call a *term attribute*. Term attributes follow a term's heading. Syntactically they are a JSON key-value map embedded into an HTML comment. For aliases there's the term attribute `aliases` whose attribute value is a string of comma-separated synonyms:

*glossary.md with a term attribute `aliases`:*

```md
# Glossary

## Cat
<!--{ "aliases": "Cats, Wildcat, House Cat" }-->
Cats are cute, ...dogs are loyal.
```

In the output files aliases will be linked to their related term:

*./docs-glossarified/pages/page2.md*

```md
# About Cats

[Cats](./glossary.md#cat) and kitten almost hidden spotting mouses in their houses. [Andreas Martin]
```

> **ⓘ** There is an alternative aliases syntax whose (single-line) form is not meant to be deprecated any time soon.
>
> ```
> ## Term
> <!-- Aliases: Term 1, Term2, ... -->
> ```
>
> However, term attribute syntax with a JSON map is going to be our way forward and required for providing multiple attributes at once. If you like to convert above Aliases to term attribute syntax a RegExp search & replace with
>
> - search `<!--[\s]?Aliases:[\s]?(.*)[\s]-->`
> - replace `<!--{ "aliases": "$1" }-->`
>
> may serve you.

## Term Hints

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file": "./glossary.md", "termHint": "🟉"},
]
```

Glossaries can be associated with *term hints*. Term hints may be used to indicate that a link refers to a glossary term and in case of [multiple glossaries][multiple-glossaries] to which one. Use `"${term}"` to control placement of a `termHint`. For example, `"☛ ${term}"` puts the symbol `☛` in front of a linkified term occurrence.

> **ⓘ Since v5.0.0**: `file` can also be used with a [glob] pattern. More see [Cross-Linking].

## Multiple Glossaries

[multiple-glossaries]: #multiple-glossaries

Sometimes you might whish to have multiple glossaries. For example as a Requirements Engineer you may not just have a glossary of business terms but also a requirements catalogue:

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file": "./glossary.md",  "termHint": "↴" },
    { "file": "./requirements.md", "termHint": "★" }
]
```

*requirements.md*

```md
## REQ-1: The system MUST provide service X
<!-- Aliases: REQ-1 -->
...
## REQ-2: The system MAY provide service Y
<!-- Aliases: REQ-2 -->
...
```

By adding *requirements.md* to the list of glossaries every use of *REQ-1* or *REQ-2* in documents gets linked to the requirements glossary. To navigate the opposite direction from a requirement to sections where those got mentioned you can generate a [Book Index](#book-index).

## Sorting your glossaries

Add `sort` with `"asc"` (ascending) or `"desc"` (descending) to glossaries you want [glossarify-md] sort for you:

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file":"./glossary.md", "termHint": "", "sort": "asc" }
]
```

Internally, glossarify-md uses `Intl.Collator` and falls back to `String.localeCompare` if the `Intl` API is missing. You can tweak collation by adding `i18n` options:

*glossarify-md.conf.json*

```json
"i18n": {
   "locale": "de",
   "ignorePunctuation": true
}
```

The i18n-object is passed *as is* to the collator function. Thus you can use additional options documented on [Mozilla Developer Portal](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Collator):

## Cross Linking

[cross-linking]: #cross-linking

> **ⓘ Since: v5.0.0**

### Term-Based Auto-Linking

*Term-based auto-linking* is what we've seen so far. It is to assume headings in markdown files called *glossaries* are *terms* that whenever being mentioned in text are being turned into a link to the glossary section where they have been defined as a term.

**Since v5.0.0** we've added a few features which let us evolve that principle into a more generic means of cross-linking beginning with support for [glob] patterns in `glossaries.file`. For example with ...

```json
"glossaries": [
    { "file": "./**/*.md"}
]
```

... you can turn any `*.md` file being processed into a "glossary". Now *all* document headings are considered terms. Mentioning the heading or an [alias] alike turns the phrase into a link to that section.

> **ⓘ Too many links?**
>
> What might happen with *globs* is, that you might feel that *too many links* are being generated disturbing the reading experience. If this is an issue for you explore options like [`linking.mentions`](#linkingmentions) or [`linking.limitByAlternatives`](#linkinglimitbyalternatives) or [`linking.headingDepths`](#linkingheadingdepths).

> **ⓘ Note:** When there are multiple `glossaries: []` entries with a `{ file: ... }` glob or path and a given file matches more than one entry then `glossaries` options of the entry latest in the array will apply. Though avoid too many glob patterns or patterns whose file sets overlap as the effects on the output get increasingly hard to understand, otherwise.

### Identifier-based Cross-Linking

If the same section heading exists more than once then you might want to link to one heading in particular. While you should consider using an [alias] to make use of term-based auto-linking, there might be situations where you whish to have manually declared links.

**Since v5.0.0** we've added support for manual cross-linking through [pandoc's concept of heading ids][pandoc-heading-ids]. These allow you to assign identifiers which are more stable for referencing than auto-generated IDs derived from the heading phrase (slugs).

> **ⓘ Note:** Pandoc's identifier syntax is not standardized in [CommonMark].

[Sample]: document `./pages/page1.md` declares a heading

*/pages/page1.md*

```md
## User Story {#s-241}
```

with heading-id `#s-241`. **Given that `#s-241` is *unique* across all documents** you can use it as a link reference:

```md
[any phrase](#s-241)
```

In any file being processed [glossarify-md] will resolve the actual path to the definition:

*/README.md*

```
[any phrase](./pages/page1.md#s-241)
```

*/pages/page2.md*

```
[any phrase](./page1.md#s-241)
```

## Generating Files

### Book Index

*glossarify-md.conf.json*

```json
"generateFiles": {
    "indexFile": {
       "file": "./book-index.md",
       "title": "Book Index"
    }
}
```

This option will generate a single book index file `./book-index.md` with glossary terms and links to book sections in which they have been mentioned. By default items will be grouped *by section of occurrence* using the section heading as a group title. You can disable or affect granularity of section-based grouping using:

```json
"indexing": {
    "groupByHeadingDepth": 0
}
```

> **ⓘ Note**: The `groupByHeadingDepth` option also affects grouping of list items in [Lists](#lists).

Let's assume you have multiple glossaries and you want to create separate book indexes from terms of those glossaries. **Since v5.1.0** you can use `indexFiles` (plural) like this:

```json
"generateFiles": {
    "indexFiles": [{
      "title": "Book Index for Glossary 1",
      "file": "./book-index-1.md",
      "glossary": "./glossary-1.md"
    },{
      "title": "Book Index for Glossary 2",
      "file": "./book-index-2.md",
      "glossary": "./glossary-2.md"
    }]
}
```

> **ⓘ Note:** If you plan on translating markdown to HTML, e.g. with [vuepress](https://vuepress.vuejs.org), be aware that a file `index.md` will translate to `index.html` which is typically reserved for the default HTML file served under a domain. We recommend you choosing another name.

### Lists

You can generate **arbitrary lists from HTML elements with an `id` attribute** and an element *classifier* to compile similar elements into the same list.

<a id="video-tutorial-part-one"></a>
*Example: Markdown document with a video element*

```md
More details see our video tutorial:

<video
  src="tutorial-1.mp4"
  id="tutorial-part-1"
  class="video"
  title="Tutorial Part 1">
</video>
```

Then to generate a *List of Videos* from all elements of `class="video"` add to your *glossarify-md.conf.json*:

```json
"generateFiles": {
    "listOf": [{
        "class": "video",
        "title": "List of Videos",
        "file": "./videos.md"
    }]
}
```

After running glossarify-md there will be a file:

*docs-glossarified/videos.md (generated)*

> ## List of Videos
>
> - [Tutorial Part 1](#video-tutorial-part-1)

You can **type less** when prefixing ids with your list classifier:

```md
<video
  id="video-tutorial-part-1"
  title="Tutorial Part 1"
  src="tutorial-1.mp4">
</video>
```

Without a `title` attribute the tool attempts to derive a list item label from an elements inner text content:

```md
<video id="video-tutorial-part-1" src="tutorial-1.mp4">
   Tutorial Part 1
</video>
```

Use *invisible* HTML anchors to generate lists from and navigate to text content:

```md
<a id="tutorial-part-1" title="Tutorial Part 1"></a>
This is not a video tutorial but a textual tutorial. The body of text can be navigated to from a List of Tutorials and uses the classifier *tutorial*.
```

> **ⓘ Note:** If you find the browser not scrolling correctly when navigating lists on GitHub, please read [Addendum: Lists in GitHub Repos](https://github.com/about-code/glossarify-md/blob/master/doc/lists-on-github.md).

<!--
**Link label extraction**

The link label for list items will be inferred in this order (first-match):

> 1. `title` attribute value (`<tag id="..." "title"="label"></tag>`)
> 1. Inner text of anchor tag (`<tag id="...">label</tag>`)
> 1. `id` attribute value, yet without list prefix (`<tag id="prefix-label"></tag>`)
> 1. Preceding section heading if `id` is just the list prefix (`<tag id="prefix"></tag>`)
> 1. Filename if `id` is just the list prefix and there is no preceding section heading.
-->

### List of Figures

So far we used [`listOf`](#lists) to generate a list from *HTML elements* in Markdown. Writing HTML can be annoying, particularly if there is handier Markdown syntax for the elements to be listed. This is where
`listOfFigures` and [`listOfTables`](#list-of-tables) fit in. It is a shortcut which makes [glossarify-md] generate the HTML anchor itself from Markdown's image syntax:

```md
![List item Label](./figure.png)
```

Then you may only need to use HTML for dynamically rendered figures, e.g. a [PlantUML](https://plantuml.com) diagram:

````md
<figure id="figure-gen">Dynamically Rendered Diagram</figure>

```plantuml
@startuml
... your PlantUML diagram code ...
@enduml
```
````

To compile both figures into the same list one way to configure [glossarify-md] is to declare a `listOf` class *figure* (for HTML elements) and tell `listOfFigures` (for `![]()` images) to use the same classifier *figure*:

*glossarify-md.conf.json* (since v5.0.0)

```json
"generateFiles": {
    "listOf": [{
        "class": "figure",
        "title": "List of Figures",
        "file": "./figures.md"
    }],
    "listOfFigures": {
        "class": "figure"
    }
}
```

This configuration which would allow you to also choose a shorter classifier like *fig* is the default, though. Therefore, if you are fine with ***figure* as the default classifier** you can omit `listOf` and just use:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOfFigures": {
        "title": "List of Figures",
        "file": "./figures.md"
    }
}
```

### List of Tables

`listOfTables` like [`listOfFigures`](#list-of-figures) is a shortcut alternative to HTML anchors with a default [`listOf`](#lists) classifier ***table***:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOfTables": {
        "title": "Tables",
        "file": "./tables.md"
    }
}
```

In contrast to images Markdown tables have no notion of a table caption. To render a list item for a table [glossarify-md] tries to infer a list item label.

One such inference looks at the **paragraph preceding the table**. If it **ends with an *emphasized* phrase** and the phrase itself is **terminated by a colon** then the tool uses that phrase as the item label:

<a id="table-of-average-prices-by-article-category"></a>

```md
[...] which we can see from the *table of average prices by article category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

But the phrase could also be it's own distinct paragraph: <a id="average-prices-by-category"></a>

```md
[...] which we can see from the average price by article category.

*Average prices by category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

**Since v3.4.0** there has also been support for *invisble* table captions using *HTML comment syntax*: <a id="avg-prices"></a>

```md
<!-- table: Average Prices by Article Category -->
| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

The result for the tables above will be:

> ## List of Tables
>
> - [Table of average prices by article category](#table-of-average-prices-by-article-category)
> - [Average prices by category](#average-prices-by-category)
> - [Average Prices by Article Category](#avg-prices)

**Since v5.0.0** and the introduction of `listOf` all the previous examples will make [glossarify-md] annotate the table with an HTML anchor. So while not recommended due to verbosity, you could of course also just add an HTML anchor yourself, like described in [`listOf`](#lists):

```md
<a id="avg-prices" class="table" title="Average Prices by Article Category"></a>

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

> **ⓘ Note:** If [glossarify-md] can't find a list item label by any of the above means it will fall back to rendering a list item
>
> 1. using the table headers separated by comma,
> 1. or if no headers, using the closest section heading
> 1. or if no section heading, using the file name.

<!--
1. **HTML anchor** see `listOf`
1. **HTML comment** in the line above the table
1. **emphasized text** at the end of the preceding paragraph
1. **column headers** separated by comma, e.g. *Category, Description, Price Avg.*
1. **preceding section heading** (tables without column headers)
1. **filename** otherwise.
-->

### Lists from Regular Expressions

**Since v5.2.0** you can use `listOf` with a regular expression pattern. Like `listOfFigures` and `listOfTables` it is meant to be a shortcut to save you from annotating Markdown with HTML elements yourself.

Let's assume you are writing a book with tasks to be accomplished by your readers. You would like to compile a *List of Tasks* in that book. You decided to use a conventional pattern which prefixes tasks with a phrase **Task:** and ends them with an exclamation mark *!*

*Document.md*

```md
Some text [...]

**Task:** Clap your hands!
```

You can then generate a *List of Tasks* with a configuration like this:

```md
{
  "generateFiles": {
    "listOf": [
      {
        "class": "task",
        "title": "Tasks in this Book",
        "file": "./list-of-tasks.md",
        "pattern": "Task: ([a-zA-Z0-9].*)!"
      }
    ]
  }
}
```

If the regular expression (RegExp) matches text in a paragraph, then *the paragraph* will be annotated with an anchor for `listOf`. Our RegExp has a Capture Group in braces `()`. Text matching the group pattern will become the list item label, so *Clap your hands* in the example because `Task:` and exclamation mark `!` are not part of the group.

> **ⓘ When to consider "markdown syntax" in the RegExp**:
>
> You may noticed that the RegExp above doesn't assume *Task:* to be written between "bold" star markers `**`. The expression won't be matched against the input *you* wrote but against *plain text* cleaned from symbols contributing to [CommonMark] or [GFM] syntax.
>
> In case you use another Markdown flavor see our addendum on [Markdown Syntax Extensions][doc-syntax-extensions]. Without a proper plug-in its syntactical elements are likely considered plain text, too. Then they need to be taken care of in the RegExp to make it match.

## Structured Export and Import

[doc-export-import]: #structured-export-and-import

[SKOS]: https://w3.org/skos

**Since v6.0.0** markdown glossary terms can be exported to a structured JSON format (file extension `.json`) or RDF N-Quads (file extension `.nq`).

*glossarify-md.conf.json* (generates ./glossary.json)

```json
{
  "glossaries": [{
    "uri": "http://basic.org/vocabulary/#",
    "file": "./glossary.md",
    "export": {
      "file": "./glossary.json"
    }
  }]
}
```

Declaring a glossary `uri` when exporting. It will make [glossarify-md] assign each term a *uniform resource identifier* by combining the glossary's `uri` with a term's book-internal identifier (see [`headingIdAlgorithm`][headingIdAlgorithm]). Note that URIs are not required to resolve to some web page but *can* do so. More on the idea behind URIs read [here][doc-vocabulary-uris]. You can import terms the same way using `import` instead.

*glossarify-md.conf.json* (generates ./glossary.md):

```json
{
  "glossaries": [{
    "uri": "http://basic.org/vocabulary/#",
    "file": "./glossary.md",
    "import": {
      "file": "./glossary.json"
    }
  }]
}
```

> ⚠ **Important:** [glossarify-md] is able to import JSON glossaries from a remote location using `https`. While it will try to remove any Markdown and HTML from imported term definitions using [strip-markdown](https://npmjs.com/package/strip-markdown) it can only do so after `JSON.parse()`. As a rule of thumb never import from untrusted sources and assume that any files from a remote location could enable a remote entity to embed malicious code into outputs or execute such code in the runtime context of [glossarify-md]. Consider importing files statically after review.

Advanced topics on importing and exporting can be found [here](https://github.com/about-code/glossarify-md/blob/master/doc/skos-interop.md).

## Node Support Matrix

The term *support* refers to *runs on the given platform* and is subject to the terms and conditions in [LICENSE](#license).

| NodeJS  | glossarify-md |                                                                           Current Test Matrix                                                                            |
| ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Current | v6+           | Tested. Should node.js introduce breaking changes which affect [glossarify-md], then we may choose to step back from supporting *Current* until it becomes the next LTS. |
| 16 LTS  | v5, v6+       | Tested + Supported                                                                                                                                                       |
| 14 LTS  | v4, v5, v6+   | Tested + Supported                                                                                                                                                       |
| 12 LTS  | v3, v4, v5    |                                                                                                                                                                          |
| 10 LTS  | v2, v3, v4    |                                                                                                                                                                          |

## Options

[Options]: #options

#### `baseDir`

- **Range:** `string`

Path to directory where to search for the glossary and markdown files. All paths in a config file except for `$schema` will be relative to *baseDir*. *baseDir* itself and `$schema` are relative to the location of the config file.

#### `excludeFiles`

- **Range:** `string[]`

Paths or Glob-Patterns of files to exclude. Excluded files will be excluded from being copied to `outDir` where they would be processed. Use [`keepRawFiles`](#keeprawfiles) if you want to have them copied to `outDir` but *ignored* by glossarify-md.

#### `generateFiles`

- **Range:** `Object`

```
{
  indexFile: {},
  listOf: [],
  listOfFigures: {},
  listOfTables: {}
}
```

#### `generateFiles.indexFile`

- **Range:** `{file: string, [title: string]}`
- **Since:** v3.0.0

Generates an index of glossary terms with links to files in which they have been mentioned.

#### `generateFiles.indexFiles`

- **Range:** `Array<{file: string, glossary: string, [title: string]}>`
- **Since:** v3.0.0

Similar to `indexFile` but allows for generating an index per glossary.

#### `generateFiles.listOf`

- **Range:** `Array<{class: string, file: string, [title: string]}>`
- **Since:** v3.5.0

If available, generates a list from HTML anchors exposing the configured `class` attribute.

#### `generateFiles.listOfFigures`

- **Range:** `{file: string, [title: string, class: string]}`
- **Since:** v3.3.0

Generates a list of figures with links to sections where the figures have been mentioned.

#### `generateFiles.listOfTables`

- **Range:** `{file: string, [title: string, class: string]}`
- **Since:** v3.4.0

Generates a list of tables.

#### `glossaries`

- **Range:** `Array`

```
[
  {
    file: string,
    termHint: string,
    sort: string],
    uri: string,
    linkUris: boolean,
    showUris: boolean|string,
    import: {},
    export: {},
  }
]
```

- **Default:** `[{ "file": "./glossary.md", "termHint": "" }]`

A list of glossary configuations, each with a path to the glossary file. Every
glossary may have an optional *termHint*. A *termHint* is a symbol character
being appended to term occurrences in order to indicate which glossary or
category a term belongs to. A term hint may be any UTF-8 character or character
sequence. If you would like to have the glossary sorted provide a *sort* direction
`"asc"` or `"desc"`.

#### `glossaries[].export`

- **Range:** `{ file: string [, context: string]} | Array<{ file: string [, context: string]}>`
- **Since:** v6.0.0

Export markdown terms in a structured JSON format. More read [here][doc-export-import].

#### `glossaries[].import`

- **Range:** `{ file: string [, context: string]}`
- **Since:** v6.0.0

Import terms from a structured JSON format and generate a markdown glossary from it. More read [here][doc-export-import].

#### `glossaries[].linkUris`

- **Range:** `boolean`
- **Default:** `false`
- **Since:** v6.0.0

When `true`, occurrences of glossary terms found in text will no longer be linked with the markdown glossary file but with an external definition on the web using a term's URI. The given glossary file will serve as a data source for a link title providing a short tooltip and may still be found from [indexFiles](#generatefilesindexfiles).

#### `glossaries[].showUris`

- **Range:** `boolean|string`
- **Default:** `false`
- **Since:** v6.0.0

When being `true` or being a template string with a placeholder `${uri}` then render term URIs in glossaries generated from [imported][doc-export-import] terms.

#### `glossaries[].uri`

See also [Vocabulary URIs][doc-vocabulary-uris].

#### `ignoreCase`

- **Range:** `boolean`

When true any occurrence of a term will be linked no matter how it was spelled.

#### `includeFiles`

- **Range:** `string[]`

Paths or Glob-Patterns for files to include. Default: `.` (includes all Markdown files within the current directory and its subdirectories). See also [`excludeFiles`](#excludefiles) and ([`keepRawFiles`](#keeprawfiles)).

#### `indexing`

- **Range:** `Object`

```
{
  headingDepths: number[],
  groupByHeadingDepth: number,
}
```

#### `indexing.groupByHeadingDepth`

- **Range:** `number` in \[1-6]
- **Default:** 6
- **Since:** v3.4.0

This option affects outputs generated with `generateFiles`. By default when
indexing terms and markdown elements they are being grouped by the heading of
the section they've been found in. In larger books with many sections and
subsections this can lead to Index files or *Tables of X* with a lot of group
headings (many representing sub- and subsubsections). Yet often it's enough for
an Index to only list the chapter or higher-level sections where some term or
element has been found in. This option allows to set the depth by which
elements shall be grouped where `1` refers to chapters (`#` headings).

#### `indexing.headingDepths`

- **Range:** `number[]` in 1-6
- **Default:** `[1,2,3,4,5,6]`
- **Since:** v5.0.0

An array with items in a range of 1-6 denoting the depths of headings that should be indexed. Excluding some headings from indexing is mostly a performance optimization, only. You can just remove the option from your config or stick with defaults. Change defaults only if you are sure that you do not want to have cross-document links onto headings at a particular depth, no matter whether the link was created automatically or written manually. Default is `[1,2,3,4,5,6]`.

The relation to [`linking.headingDepths`](#linkingheadingdepths) is that *this* is about *knowing the link targets* whereas the latter is about *creating links automatically ...based on knowledge about link targets*. Yet, indexing of headings is further required for existing (cross-)links like `[foo](#heading-id)` and resolving the path to where a heading with such id was declared, so for example `[foo](../document.md#heading-id)`.

#### `i18n`

- **Range**: `Object`

```
{
  locale: string,
  [localeMatcher: string],
  [caseFirst: string],
  [ignorePunctuation: boolean],
  [numeric: boolean],
  [sensitivity: string],
  [usage: string]
}`
```

Locale options to control [sorting](#sorting-your-glossaries). See [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator).

#### `keepRawFiles`

- **Range:** `string[]`

Paths or Glob-Patterns for Markdown files to copy to `outDir` but keep there as they are without
glossarifying and linking. Non-markdown files won't be processed anyways, so no need to add those.

#### `linking`

- **Range:** `Object`

```
{
  baseUrl: string,
  byReferenceDefinition: boolean,
  paths: "relative" | "absolute",
  pathComponents: ["path", "file", "ext"],
  mentions: "all" | "first-in-paragraph",
  headingAsLink: boolean,
  headingDepths: number[],
  headingIdAlgorithm: "github" | "md5" | "md5-7" | "sha256" | "sha256-7",
  headingIdPandoc: boolean,
  limitByAlternatives: number
}
```

#### `linking.baseUrl`

- **Range:** `string`

URL to prepend to links. Only effective with `linking.paths: "absolute"`. In most situations, e.g. when hosting markdown files in a repository or processing markdown files with an HTML converter omitting a pre-defined `baseUrl` and using `linking.paths: "relative"` is likely to work better.

#### `linking.byReferenceDefinition`

- **Range:** `boolean`
- **Default:** `true`,
- **Since:** v6.0.0

Whether to convert inline-links to [link reference definitions] (size-efficient).

#### `linking.headingAsLink`

- **Range:** `boolean`
- **Default:** `true`
- **Since:** v6.0.0

Whether to linkify headings. Note that some Markdown-to-HTML renderers need headings to be linkified in order to be rendered URL-addressable and navigable. Others like [pandoc] don't need linkified headings but special syntax.

See also:

- [`linking.headingIdPandoc`](#linkingheadingidpandoc)

#### `linking.headingDepths`

- **Range:** `number[]` in 1-6
- **Default:** `[2,3,4,5,6]`
- **Since:** v5.0.0

Use this option to select markdown heading depths which should be considered terms or sections for cross-linking. For example, to only consider headings `## text` at depth 2 or `### text` at depth 3 but not at depths 1 and 4-6 provide an array `[2,3]`

> **ⓘ Note:** Headings at the given depths must be indexed. So they must be in the set of [`indexing.headingDepths`](#indexingheadingdepths).

#### `linking.headingIdAlgorithm`

[headingIdAlgorithm]: #linkingheadingidalgorithm

- **Range:** `"github" | "md5" | "md5-7" | "sha256" |"sha256-7"`
- **Default:** `"github"`
- **Since:** v6.0.0

Algorithm to use for generating heading identifiers used as `#` URL-fragment ("slugs"). Option value `"github"` will only guarantee *uniqueness per file* whereas `md5` and `sha256` options will generate a hash *unique in the fileset*. The hash value will depend on

```
hash (
  glossary file path,
  glossary file name without file extension,
  glossary uri,
  github-slugger(term),
  baseUrl
)
```

where `baseUrl` will be used only if there's no glossary uri. The `*-7` hashsum variants truncate a hash to at most 7 symbols which are still unlikely to collide in normal books.

#### `linking.headingIdPandoc`

- **Range:** `boolean`
- **Default:** false
- **Since:** v6.0.0

Since v5 there has been support for *parsing* pandoc-style heading IDs from input markdown. In v6 we added support for *writing*  pandoc-style `{#id}` identifiers to output markdown to facilitate postprocessing with [pandoc].

> **ⓘ Note:** Pandoc's identifier syntax is not standardized in [CommonMark].

See also

- [`linking.headingIdAlgorithm`](#linkingheadingidalgorithm)
- [`linking.paths`](#linkingpaths)

#### `linking.limitByAlternatives`

- **Range:** `number[]` in -95 - +95
- **Default:** 95
- **Since:** v5.0.0

Control how a term occurrence is linkified if there are *multiple  definitions* of a term:

- **positive value**: the system *creates links to alternative definitions but no more than `x` links*.
- **negative value**: the system does *not create a term-link at all once there are more than `x` alternative definitions* of a term or heading.
- **zero**: create a link but to a single out of all definitions, only

#### `linking.mentions`

- **Range:** `"all" | "first-in-paragraph"`
- **Default:** `"all"`
- **Since:** v5.0.0

By default every mention of a term will be linkified. Sometimes this can
result in too much links affecting readability. This option provides finer
control of linkify behavior.

#### `linking.paths`

[opt-linking]: #linkingpaths

- **Range:** `"relative" | "absolute" | "none" `
- **Default:** `"relative"`

Whether to create absolute or relative link-urls to the glossary.

> **Important:** Using `"absolute"` without a `baseUrl` will produce an absolute file system path which you might not want to publish.

#### `linking.pathComponents`

- **Range:** `string[] with "path", "file", "ext"`
- **Default:** `["path", "file", "ext"]`
- **Since:** v6.0.0

Allows to tweak which components of a file path should make it into auto-generated links. Examples:

- `["path", "file", "ext"]` => `./glossary/default.md#term`
- `["path", "file"]` => `./glossary/default#term`
- `["file"]` => `default#term`

Use `linking.paths: "none"` if you would like to have a fragment (`#`) but no path components.

#### `outDir`

- **Range:** `string`

The directory where to write output files to.

> **Important:** using `.` or `./` is going to overwrite your input files. Only do this on a copy of your input
> files or if you are able to roll back any changes or if you know the outcome satisfies your needs.

The recommendation is to write outputs to a separate directory such as `../out` or `../target` or `../docs-glossarified`.

#### `outDirDropOld`

- **Range:** `boolean`

If `true` remove old `outDir` before writing a new one, otherwise overwrite files. Drops orphan files that have intentionally been removed from `baseDir`.

#### `reportNotMentioned`

- **Range:** `boolean`

Report on terms which exist in a glossary but have neither been mentioned directly nor with any of its aliases.

#### `unified`

[opt-unified]: #unified

- **Range:** `{ rcPath: string } | { settings: object, plugins: object|array }`

Extended [unified configuration][unified-config]. See also [Markdown Syntax Extensions][doc-syntax-extensions].

## Special Thanks go to

- [John Gruber](https://daringfireball.net/projects/markdown/), author of the Markdown syntax
- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://unifiedjs.com/), [remarkjs](https://github.com/remarkjs) and many more
- and all the other great people publishing modules of value to the tool - directly or transitively.

## License

[MIT](LICENSE) © [Andreas Martin](https://github.com/about-code)
