# glossarify-md

![Tests (Functional)](https://github.com/about-code/glossarify-md/workflows/Tests%20\(Functional\)/badge.svg)
![Nightly Tests (Latest Dependencies)](https://github.com/about-code/glossarify-md/workflows/Tests%20\(with%20latest%20deps\)/badge.svg)

[glossarify-md] is a command line tool to help Markdown writers with

- **Cross-Linking** (prime use case): autolink terms to some definition in a glossary
- **Indexes**: generate indexes from glossary terms and navigate to where they were mentioned
- **Lists**: generate arbitrary lists such as *List of Tables*, *List of Figures*, *List of Listings*, *List of Definitions*, *List of Formulas*, and so forth...

[vuepress] users might be interested in learning [how to use the tool with vuepress](https://github.com/about-code/glossarify-md/blob/master/doc/vuepress.md).

[CommonMark]: https://www.commonmark.org

[GFM]: https://github.github.com/gfm/

[glob]: https://github.com/isaacs/node-glob#glob-primer

[glossarify-md]: https://github.com/about-code/glossarify-md

[micromark]: https://github.com/micromark/

[pandoc-heading-ids]: https://pandoc.org/MANUAL.html#heading-identifiers

[remark]: https://github.com/remarkjs/remark

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

[remark-footnotes]: https://npmjs.com/package/remark-footnotes

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
  - [Index](#index)
  - [Lists](#lists)
  - [List of Figures](#list-of-figures)
  - [List of Tables](#list-of-tables)
- [Markdown Syntax Extensions](#markdown-syntax-extensions)
  - [Configure glossarify-md](#configure-glossarify-md)
  - [Install Remark Plug-Ins](#install-remark-plug-ins)
  - [Load and Configure Remark Plug-Ins](#load-and-configure-remark-plug-ins)
- [Node Support Matrix](#node-support-matrix)
- [Options](#options)
- [Special Thanks go to](#special-thanks-go-to)
- [License](#license)

## Install

#### Option 1: Install globally:

```
npm i -g glossarify-md

glossarify-md --init --new
glossarify-md --config ./glossarify-md.conf.json
```

#### Option 2: Install locally as a project dependency:

```
npm i glossarify-md

npx glossarify-md --local --init --new
npx glossarify-md --config ./glossarify-md.conf.json
```

... or add an npm-script to your `package.json`:

*package.json*

```json
scripts: {
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
}
```

```
npm run glossarify
```

## Configuration

> **Since v5.0.0**

Generate a configuration with the `--init` option:

```
npx glossarify-md --init > glossarify-md.conf.json
```

*glossarify-md.conf.json (minimal)*

```json
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
```

- use `--init --new` to generate a config and the default files and folders
- add `--more` to generate a config with more [options] and default values
- add `--local` to load the config schema from the `node_modules` directory

*glossarify-md.conf.json* (`--local`)

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

> **Since v4.0.0**

Use `--shallow` or `--deep`

1. to provide a configuration solely via command line
1. to merge a configuration with a config file

*Example: use `--shallow` to *replace* simple top-level options:*

```
glossarify-md
  --config ./glossarify-md.conf.json
  --shallow "{ 'baseDir':'./docs', 'outDir':'../target' }"
```

*Example: use `--shallow` to *replace* complex nested options like `glossaries` alltogether:*

```
glossarify-md
  --config ./glossarify-md.conf.json
  --shallow "{ 'glossaries': [{'file':'./replace.md'}] }"
```

*Example: use `--deep` to *extend* complex nested options, e.g. to *add* another array item to `glossaries` in the config file write:*

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

*docs/pages/page1.md*

```md
# Demo

This is a text which uses a glossary Term to describe something.
```

Then run [glossarify-md] with a [glossarify-md.conf.json](#configuration).

**Output Results**

Augmented versions of the source files have been written to the output directory:

*./docs-glossarified/pages/page1.md*

```md
# [Demo](#demo)

This is a text which uses a glossary [Term ↴][1] to describe something.

[1]: ../glossary.md#term "A glossary term has a short description."
```

> ## [Demo](#demo)
>
> This is a text which uses a glossary [Term ↴][1] to describe something.
>
> [1]: #term "A glossary term has a short description."

Headings in glossary files have got an anchor ID and have been made linkable:

*./docs-glossarified/glossary.md*:

```md
# [Glossary](#glossary)

## [Term](#term)

A glossary term has a short description. The full description contains both sentences.
```

> ## [Glossary](#glossary)
>
> ### [Term](#term)
>
> A glossary term has a short description. The full description contains both sentences.

## What's not Linked

Some syntactic positions of a term occurrence are **excluded** from being linked to the glossary. These are

- Headlines `#`
- Blockquotes `>`
- Preformatted blocks ` ```, ~~~ `
- (Markdown) links `[]()`
- HTML `<a>text</a>`

Terms found in Markdown blockquotes (`>`) aren't linked to a term definition based on the premise that a quoted source entity may not share the same definition of a term like the entity who quotes it. They could use a term in different semantic contexts.

## Aliases and Synonyms

[alias]: #aliases-and-synonyms

[aliases]: #aliases-and-synonyms

Aliases can be defined in an HTML comment with the keyword `Aliases:` followed by a comma-separated list of alternative terms.

*glossary.md*

```md
# Glossary

## Cat
<!-- Aliases: Cats, Wildcat, House Cat -->
Cats are cute, ...dogs are loyal.
```

In the output files aliases will be linked to their related term:

*./docs-glossarified/pages/page2.md*

```md
# About Cats

[Cats](./glossary.md#cat) and kitten almost hidden spotting mouses in their houses. [The Author]
```

## Term Hints

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file": "./glossary.md", "termHint": "↴"},
]
```

Glossaries can be associated with *term hints*. Term hints may be used to indicate that a link refers to a glossary term and in case of [multiple glossaries][multiple-glossaries] to which one.

> **Since v2.0.0**:
> Use `"${term}"` to control placement of a `termHint`. For example, `"☛ ${term}"` puts the symbol `☛` in front of the link.

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

By adding *requirements.md* to the list of glossaries every use of *REQ-1* or *REQ-2* gets linked to the requirements catalogue. Read on to find out how to generate an index in order to answer the question in which particular sections those requirements got mentioned.

> **Since v5.0.0**: `file` can be a [glob] pattern. More see [Cross-Linking].

## Sorting your glossaries

> **Since v3.6.0**

Add `sort` direction `"asc"` or `"desc"` to glossaries for which you want [glossarify-md] to sort them for you:

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file":"./glossary.md", "termHint": "", "sort": "asc" }
]
```

Internally sorting uses `Intl.Collator` and falls back to `String.localeCompare` if the `Intl` API is missing. You can tweak collation by adding `i18n` options:

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

> **Since: v5.0.0**

### Term-Based Auto-Linking

*Term-based auto-linking* is what we've seen so far. It is to assume headings in markdown files called *glossaries* are *terms* that whenever being mentioned in text are being turned into a link to the glossary section where they have been defined as a term (*linkification*).

**Since v5.0.0** we've added a few features which let us evolve that principle into a more generic means of cross-linking beginning with support for [glob] patterns in `glossaries.file`. For example with...

```json
"glossaries": [
    { "file": "./**/*.md"}
]
```

...you can turn every `*.md` file being processed into a "glossary". Now *all* document headings are considered terms. Mentioning the heading or an [alias] alike turns the phrase into a link to that section.

> **Note:** If `file` is a glob pattern other options like `termHint` or `sort` are being ignored. You need to declare a glossary item with a `file` *path* if you need these options specific to a single file.

**Too many links?**

What may happen with term-based linking and *globs* is, that once a lot of headings become terms, there might be *too many links* generated. If this is an issue for you explore [`linking.*`][opt-linking] options like `linking.mentions`, `linking.limitByAlternatives` or `linking.headingDepths` to tweak linkify behavior.

### Identifier-based Cross-Linking

If the same section heading exists more than once then you might want to link to one heading in particular.
While you should consider using an [alias] to make use of term-based auto-linking, there might be situations where you whish to have manually declared links.

**Since v5.0.0** we've added support for manual cross-linking through [pandoc's concept of heading ids][pandoc-heading-ids]. These allow you to assign identifiers which are more stable for referencing than auto-generated IDs derived from the heading phrase (slugs).

> **Note:** Pandoc's identifier syntax is not standardized in [CommonMark].

[Sample]: document `./pages/page1.md` declares a heading

*/pages/page1.md*

```md
## User Story {#s-241}
```

with heading-id `#s-241`. **Given that `#s-241` is *unique* across all documents** you can use it as a link reference

```md
[any phrase](#s-241)
```

in any file being processed and [glossarify-md] will resolve the relative path:

*/README.md*

```
[any phrase](./pages/page1.md#s-241)
```

*/pages/page2.md*

```
[any phrase](./page1.md#s-241)
```

## Generating Files

### Index

> **Since v3.0.0**

*glossarify-md.conf.json*

```json
"generateFiles": {
    "indexFile": {
       "file": "./book-index.md",
       "title": "Book Index"
    }
}
```

This option will generate a file `./book-index.md` with glossary terms and links to book sections in which they have been mentioned.

> **Note**: If you plan on translating markdown to HTML, e.g. with [vuepress](https://vuepress.vuejs.org), be aware that a file `index.md` will translate to `index.html` which is typically reserved for the default HTML file served under a domain. It is recommended to choose another name.

By default items will be grouped *by section of occurrence* using the section heading as a group title. You can disable or affect granularity of section-based grouping using:

```json
"indexing": {
    "groupByHeadingDepth": 0
}
```

> **Note**: This setting also affects grouping of list items in [Lists](#lists).

### Lists

> **Since v3.5.0**

You can generate **arbitrary lists** like *Lists of References* from HTML elements with an `id` attribute and a *classifier*. For example in your documents you could use an *invisible* HTML anchor like

<a id="togr"></a>

```md
<a id="togr" class="ref" title="Theory of General Relativity"></a> ...a citation of the work.
```

Then to generate a *List of References* configure `listOf`:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOf": [{
        "title": "References",
        "file": "./references.md",
        "class": "ref"
    }]
}
```

You can **type less** by using an *id-prefix* and let [glossarify-md] infer the list item label from the text between the HTML tags:

```md
<cite id="ref-togr">Theory of General Relativity</cite>
```

<a id="ref-togr-work"></a>
**Alternative list item labels** are possible with the `title` attribute.

```md
The <cite id="ref-togr-work" title="A. Einstein, 1916. Die Grundlagen
der Allgemeinen Relativitätstheorie. Annalen der Physik, Band 49,
Seite 769-822.">Theory of General Relativity</cite> by Albert
Einstein was groundbreaking.
```

*Result: docs-glossarified/references.md (generated)*

> ## List of References
>
> - [Theory of General Relativity](#togr)
> - [A. Einstein, 1916. Die Grundlagen
>   der Allgemeinen Relativitätstheorie. Annalen der Physik, Band 49,
>   Seite 769-822.](#ref-togr-work)
> - ...

<a id="cite-note-github"></a>

> **Note:** [GitHub] `.md` file preview sanitizes files before rendering them and strips off [semantic html tags](https://www.w3schools.com/html/html5\_semantic_elements) like `<cite>`. Thus, when navigating a GitHub repo from the `.md` preview of a list generated from `<cite>`, like in the example above, the browser *can't* sroll to the correct target location of `<cite>`. Use `<span>` or `<a>` tags if you care.

[GitHub]: https://github.com

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

> **Since v3.3.0**

Since there is no standardized *Markdown anchor syntax* so far [`listOf`](#lists) requires you to use *HTML syntax* which can be tedious to write, though. `listOfFigures` generates navigable HTML from Markdown's image syntax:

```md
![List item Label](./figure.png)
```

You can still use HTML for dynamically rendered figures, e.g. a [PlantUML](https://plantuml.com) diagram:

````md
<figure id="figure-gen">Dynamically Rendered Diagram</figure>

```plantuml
@startuml
... your PlantUML diagram code ...
@enduml
```
````

To add both figures to the same list one way to configure [glossarify-md] is to declare a *`listOf` class X* and telling `listOfFigures` to use the same class:

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

With this you could also choose a shorter classifier like ***fig***. If you like to stick with ***figure*** you can also use:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOfFigures": {
        "title": "Figures",
        "file": "./figures.md"
    }
}
```

> **Note:** The short version has been available since v3.3.0 but generates navigable HTML since v5.0.0.

### List of Tables

> **Since v3.4.0**

Like with `listOfFigures` there's a `listOfTables` option which generates HTML anchors
for a [list](#lists) from Markdown table syntax. The following configuration generates a *List of Tables* with the implicit `listOf` classifier ***table***:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOfTables": {
        "title": "Tables",
        "file": "./tables.md"
    }
}
```

Markdown tables have no notion of a table caption. To render a list item [glossarify-md] tries to infer an item label from a paragraph preceding the table. If it ends with an *emphasized* phrase and the phrase itself **is terminated by a colon**, then it uses that phrase as the item label:

<a id="table-of-average-prices-by-article-category"></a>

```md
[...] which we can see from the *table of average prices by article category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

> ## List of Tables
>
> - [Table of average prices by article category](#table-of-average-prices-by-article-category)
> - [Average prices by category](#average-prices-by-category)
> - [Average Prices by Article Category](#avg-prices)

The phrase could also be it's own distinct paragraph:
<a id="average-prices-by-category"></a>

```md
[...] which we can see from the average price by article category.

*Average prices by category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

**Since v3.4.0** there has also been support for *invisble* table captions using an *HTML comment syntax*:
<a id="avg-prices"></a>

```md
<!-- table: Average Prices by Article Category -->
| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

Since **v5.0.0** all the previous variants will generate an invisible HTML anchor to integrate with `listOf`. You can use them interchangably with or replace them by an HTML anchor as well:

```md
<a id="avg-prices" class="table" title="Average Prices by Article Category"></a>

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

If [glossarify-md] can't find a table caption by any of the above means it will fall back to rendering a list item using the table headings separated by comma, the section of occurrence or the file name (in this order).

<!--
1. **HTML anchor** see `listOf`
1. **HTML comment** in the line above the table
1. **emphasized text** at the end of the preceding paragraph
1. **column headers** separated by comma, e.g. *Category, Description, Price Avg.*
1. **preceding section heading** (tables without column headers)
1. **filename** otherwise.
-->

## Markdown Syntax Extensions

[syntax-extensions]: #markdown-syntax-extensions

> **Since v5.0.0**

[glossarify-md] supports [CommonMark] and [GitHub Flavoured Markdown (GFM)][GFM]. Syntax not covered by these specifications may not make it correctly into output documents. For example *Frontmatter* syntax is such an extension popularized by many static site generators:

*Frontmatter Syntax*

```
---
key: This is a frontmatter
---
```

Without special support for it a Markdown parser will recognise the line of trailing dashes as Markdown syntax for a *heading*. To make it aware of the leading dashes and that they contribute to syntax for a *frontmatter* we need to extend the parser ([remark]). **Since v5.0.0** we have opened [glossarify-md] to the [remark plug-in ecosystem][remark-plugins] and its extensive support of additional syntaxes and tools.

> **Note:** glossarify-md must not be held responsible for issues arising due to installing additional plug-ins.

### Configure glossarify-md

*Add this to your glossarify-md.conf.json*

```json
{
  "unified": {
    "rcPath": "../remark.conf.json"
  }
}
```

The file path is relative to `baseDir`.

### Install Remark Plug-Ins

*Example: Install a frontmatter plug-in*

```
npm install remark-frontmatter
```

### Load and Configure Remark Plug-Ins

*remark.conf.json:*

```json
{
  "plugins": {
    "remark-frontmatter": {
      "type": "yaml",
      "marker": "-"
    }
  }
}
```

The schema follows the [unified configuration][unified-config] schema. `remark-frontmatter` must be the name of the npm package you installed before. Any properties of the object are specific to the plug-in.

It's also possible to have this configuration inside a *glossarify-md.conf.json* but keep in mind that anything under the `unified` key is a [unified configuration][unified-config] whose schema is *not* subject to the [glossarify-md] config schema.

> **[unified], [remark], [micromark], uhh..**
>
> tl;dr: Just remember that you need [remark plug-ins][remark-plugins] to extend [glossarify-md]'s markdown processing.
>
> [glossarify-md] builds on [unified], an umbrella project around *text file processing in general*. We configure it with [remark], a *processor* for *Markdown text files in particular*. [remark] has recently switched *its* base layer which is now called [micromark]. You are likely to come across that project as well but unless written otherwise, you won't have to install anything related to [micromark] yourself.

## Node Support Matrix

The term *support* refers to *runs on the given platform* and is subject to the terms and conditions in [LICENSE](#license).

| Node-Version |                                                                    compatibility & support status                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current      | Tested. Should Node introduce breaking changes which affect [glossarify-md], then we may choose to step back from supporting *Current* until it becomes the next LTS. |
| 12.x LTS     | Tested + Supported                                                                                                                                                    |
| 10.x LTS     | Tested + Supported                                                                                                                                                    |

## Options

[Options]: #options

#### `baseDir`

- **Range:** `string`

Path to directory where to search for the glossary and markdown files. All paths in a config file except for `$schema` will be relative to *baseDir*. *baseDir* itself and `$schema` are relative to the location of the config file.

#### `excludeFiles`

- **Range:** `string[]`

Paths or Glob-Patterns of files to exclude. Use `keepRawFiles` if you just
want to ignore certain markdown files from being modified.

#### `generateFiles.indexFile`

- **Range:** `{file: string, [title: string]}`
- **Since:** v3.0.0

Generates an index of glossary terms with links to files in which they have been mentioned. See section [Additional Features](https://github.com/about-code/glossarify-md#index-of-terms-and-where-they-have-been-used) for a configuration example.

#### `generateFiles.listOf`

- **Range:** `Array<{class: string, file: string, [title: string]}>`
- **Since:** v3.5.0

If available, generates a list from HTML anchors exposing the configured `class` attribute. See section [Additional Features](https://github.com/about-code/glossarify-md#lists) for an example.

#### `generateFiles.listOfFigures`

- **Range:** `{file: string, [title: string, class: string]}`
- **Since:** v3.3.0

Generates a list of figures with links to sections where the figures have been mentioned. See section [Additional Features](https://github.com/about-code/glossarify-md#list-of-figures) for a configuration example.

#### `generateFiles.listOfTables`

- **Range:** `{file: string, [title: string, class: string]}`
- **Since:** v3.4.0

Generates a list of tables. See section [Additional Features](https://github.com/about-code/glossarify-md#list-of-tables) for an example.

#### `glossaries`

- **Range:** `Array<{file: string, [termHint: string], [sort: string]}>`
- **Default:** `[{ "file": "./glossary.md", "termHint": "" }]`

A list of glossary configuations, each with a path to the glossary file. Every
glossary may have an optional *termHint*. A *termHint* is a symbol character
being appended to term occurrences in order to indicate which glossary or
category a term belongs to. A term hint may be any UTF-8 character or character
sequence. If you would like to have the glossary sorted provide a *sort* direction
`"asc"` or `"desc"`.

#### `ignoreCase`

- **Range:** `boolean`

When true any occurrence of a term will be linked no matter how it was spelled.

#### `includeFiles`

- **Range:** `string[]`

Paths or Glob-Patterns for files to include.

#### `indexing.groupByHeadingDepth`

- **Range:** `number` in \[1-6]
- **Since:** v3.4.0

This option affects outputs generated with `generateFiles`. By default when
indexing terms and markdown elements they are being grouped by the heading of
the section they've been found in. In larger books with many sections and
subsections this can lead to Index files or *Tables of X* with a lot of group
headings (many representing sub- and subsubsections). Yet often it's enough for
an Index to only list the chapter or higher-level sections where some term or
element has been found in. This option allows to set the depth by which
elements shall be grouped where `1` refers to chapters (`#` headings).

#### `indexing.headingDepth`

- **Range:** `number[]` in 1-6
- **Since:** v5.0.0

An array with items in a range of 1-6 denoting the depths of headings that should be indexed. Excluding some headings from indexing is mostly a performance optimization, only. You can just remove the option from your config or stick with defaults. Change defaults only if you are sure that you do not want to have cross-document links onto headings at a particular depth, no matter whether the link was created automatically or written manually. Default is `[1,2,3,4,5,6]`.

The relation to [`linking.headingDepths`](#linkingheadingdepths) is that *this* is about *knowing the link targets* whereas the latter is about *creating links automatically ...based on knowledge about link targets*. Yet, indexing of headings is further required for existing (cross-)links like `[foo](#heading-id)` and resolving the path to where a heading with such id was declared, so for example `[foo](../document.md#heading-id)`.

#### `i18n`

- **Range**:`  { locale: string, [localeMatcher: string],
    [caseFirst: string], [ignorePunctuation: boolean],
    [numeric: boolean], [sensitivity: string], [usage: string] } `

Locale options to control [sorting](#sorting-your-glossaries). See [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator).

#### `keepRawFiles`

- **Range:** `string[]`

Paths or Glob-Patterns for (markdown) files to copy to `outDir` but ignore in
glossarification and linking. Non-markdown files will always be kept as is so no
need to add those.

#### `linking.paths`

[opt-linking]: #linkingpaths

- **Range:** `"relative" | "absolute"`

Whether to create absolute or relative link-urls to the glossary.
The use of `"absolute"` may require a `linking.baseUrl`.

> **Important:** Using `"absolute"` without a `baseUrl` will produce an absolute file system path which you might not want to publish.

#### `linking.baseUrl`

- **Range:** `string`

URL to prepend to links. Only effective with `linking.paths: "absolute"`.
In most situations, e.g. when hosting markdown files in a repository or
processing markdown files with an MD to HTML converter omitting a pre-defined
`baseUrl` and using `linking.paths: "relative"` is likely to work better.

#### `linking.mentions`

- **Range:** `"all" | "first-in-paragraph"`
- **Since:** v5.0.0

By default every mention of a term will be linkified. Sometimes this can
result in too much links affecting readability. This option provides finer
control of linkify behavior.

#### `linking.headingDepths`

- **Range:** `number[]` in 1-6
- **Since:** v5.0.0

Use this option to select markdown heading depths which should be considered for
searching and linking. E.g. to only consider headings `## text` (depth 2) or
`### text` (depth 3) but not `#### text` (depth 4) provide an array `[2,3]`.
Default is `[2,3,4,5,6]`.

In case you have modified [`indexing.headingDepths`](#indexingheadingdepths), be aware that this option only makes sense if it is a *full subset* of the items in [`indexing.headingDepths`](#indexingheadingdepths).

#### `linking.limitByAlternatives`

- **Range:** `number[]` in -95 - +95
- **Since:** v5.0.0

If there are multiple definitions of a term or heading then this option can be used to limit the number of links to alternative definitions. When using a positive value, then the system creates links to alternative definitions *but no more than...*. If the number is negative then the numerical amount indicates to *not create a term-link at all once there are more than...* definitions of a term. This option may be helpful in certain cases where terms appear to have many alternative definitions but just because they are headings of pages that follow a certain page template and thus are repeatedly "defined".

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

Extended [unified configuration][unified-config]. See also [Markdown Syntax Extensions][syntax-extensions].

## Special Thanks go to

- [John Gruber](https://daringfireball.net/projects/markdown/), author of the Markdown syntax
- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://unifiedjs.com/), [remarkjs](https://github.com/remarkjs) and many more
- and all the other great people publishing modules of value to the tool - directly or transitively.

## License

[MIT](LICENSE) © [Andreas Martin](https://github.com/about-code)
