# glossarify-md

*Term-to-Definition*- and *Cross-Linking* for Markdown.


[vuepress](https://vuepress.vuejs.org) users may be interested to learn [how to use the tool with vuepress](https://github.com/about-code/glossarify-md/blob/master/doc/vuepress.md).

## Table of Contents

- [Install](#install)
- [Sample](#sample)
- [Results](#results)
- [Configuration](#configuration)
- [Additional Features](#additional-features)
   - [Aliases and Synonyms](#aliases-and-synonyms)
   - [Multiple Glossaries](#multiple-glossaries)
   - [Index of terms and where they have been used](#index-of-terms-and-where-they-have-been-used)
   - [List of Figures](#list-of-figures)
   - [List of Tables](#list-of-tables)
   - [Arbitrary Lists of Anything](#arbitrary-lists-of-anything)
- [Options](#options)

## Install

```
npm i -g glossarify-md
```

## Sample

We assume a sample project with the following structure:

```
${root}
   +- src/
   |    +- pages/
   |    |    |- page1.md
   |    |    `- page2.md
   |    |
   |    |- README.md
   |    |- citations.md
   |    `- glossary.md
   |
   +- target/ (Generated output directory)
   `- glossarify-md.conf.json
```

Your original glossary is a file

*src/glossary.md*
```md
# Glossary

## Term

A glossary term has a short description. The full description contains both sentences.
```

Your original files may just use the term *Term* anywhere in text:

*src/pages/page1.md*
```md
# Demo

This is a text which uses a glossary Term to describe something.
```

Then in `${root}` of your project run *glossarify-md* with a [configuration](#configuration) file.

```
glossarify-md --config ./glossarify-md.conf.json
```

## Results

After running *glossarify-md* there have been written  modified versions of the source files to the output directory. Headings in glossary files have been made referencable...

*./target/glossary.md*:

```md
# Glossary

## [Term](#term)

A glossary term has a short description. The full description contains both sentences.
```

... and occurrences of the term in markdown files have been replaced with links to the term definition in the glossary:

*./target/pages/page1.md*
```md
# Demo

This is a text which uses a *Glossary [Term ↴][1]* to describe something.

[1]: ../glossary.md#term "A glossary term has a short description."
```

Some syntactic positions of a term are **excluded** from being linked to the glossary. These are

- Headlines
- Blockquotes
- Preformatted blocks
- (Markdown) links

> **Important:** Unfortunately, we can't exclude text between the opening and closing angle brackets of an HTML link tag, at the moment. In a markdown syntax tree something like `<a href="">term</a>` is represented as distinct HTML nodes with arbitrary complex markdown nodes in between. Therefore a term found between those HTML tags currently results in
> ```
> <a href="">[term][1]</a>
>
> [1] ./glossary.md#term
> ```
> Terms found in blockquotes are not automatically linked to a glossary definition since a quoted source entity may not share the same definition of a term as the entity who quotes it. It may use a term in a completely different semantic context.

## Configuration

### ...via command-line (not all options supported)
```
glossarify-md
  --baseDir "./src"
  --outDir "../target"
  --linking "relative"
  --includeFiles ["."]
  --excludeFiles ["node_modules"]
```

### ...via config file

```
glossarify-md --config ./glossarify-md.conf.json
```

*glossarify-md.conf.json* (further options see [below](#options))
```json
{
  "$schema": "./node_modules/glossarify-md/conf.schema.json",
  "baseDir": "./src",
  "outDir": "../target",
  "glossaries": [
    { "file": "./glossary.md",  "termHint": "↴" },
  ],
  "includeFiles": ["."],
  "excludeFiles": ["node_modules"],
  "linking": "relative",
  "baseUrl": ""
}
```
> **Since v2.0.0**: If you need more control about placement of a `termHint` symbol, you can use `"${term}"` as a placeholder. For example, `"☛ ${term}"` puts the hint symbol `☛ ` in front of the term.

<!-- baseUrl only effective with linking "absolute" -->

## Additional Features

### Aliases and Synonyms

Aliases can be defined in an HTML comment with the keyword `Aliases:` followed by a comma-separated list of alternative terms.

*glossary.md*
```md
# Glossary

## Cat
<!-- Aliases: Cats, Wildcat, House Cat -->
Cats are cute, ...dogs are loyal.
```

In the output files aliases will be linked to their related term:

*./target/pages/page2.md*
```md
# About Cats

[Cats](./glossary.md#cat) and kitten almost hidden spotting mouses in their houses. [The Author]
```

### Multiple Glossaries

*glossarify-md.conf.json*
```json
"glossaries": [
    { "file": "./glossary.md",  "termHint": "↴" },
    { "file": "./requirements.md", "termHint": "★" }
]
```
Multiple glossaries can be very valuable in professional writing or documentation. In fact any heading in any document can serve as the source for terms. For example in requirements documents you often not just have a glossary but a requirement catalogue, like

*requirements.md*

```md
## REQ-1: The system MUST provide service X
<!-- Aliases: REQ-1 -->
...
## REQ-2: The system MAY provide service Y
<!-- Aliases: REQ-2 -->
...
```

Glossaries can be associated with *term hints*. A term hint will be visible as an appendix to a term occurrence and can be used to indicate that a particular term and link refers to a glossary term. They can also be used to highlight which glossary a term belongs to.

### Index of terms and where they have been used

> **Since v3.0.0**

*glossarify-md.conf.json*:
```json
"generateFiles": {
    "indexFile": {
       "file": "./book-index.md",
       "title": "Book Index"
    }
}
```
This option will generate a file `./book-index.md` with a list of glossary terms and links to book sections in which they have been mentioned. The `title` argument is optional. If missing the value given in the example will be the default.

> **Note**: If you plan translating markdown to HTML, e.g. with [vuepress](https://vuepress.vuejs.org), be aware that a file `index.md` will translate to `index.html` which is typically reserved for the default HTML file served under a domain. You may want to choose another name.

### List of Figures

> **Since v3.3.0**

```json
"generateFiles": {
    "listOfFigures": { "file": "./figures.md", "title": "Abbildungen" }
}
```

This option will generate an index file `./figures.md` with a list of figures grouped by sections of occurrence. You can control heading depth for grouping and e.g. generate a flat list without any grouping using
```json
"indexing": {
    "groupByHeadingDepth": 0
}
```

### List of Tables

> **Since v3.4.0**

```json
"generateFiles": {
    "listOfTables": { "file": "./tables.md", "title": "Abbildungen" }
}
```
This option will generate a file `./tables.md` with a list of tables grouped by sections of occurrence. See [`groupByHeadingDepth`](#list-of-figures) to find out how to control grouping.

Markdown tables have no inherent notion of a table label. *glossarify-md* scans for two patterns of user-defined table labels and attempts to infer a table label otherwise.

#### Invisible table label with HTML comment

Provide an invisible table label with an HTML comment pattern `<!-- table: ... -->` preceding the table.

```md
<!-- table: Average Prices by Article Category -->
| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

#### Visible table label

A visible table label will be inferred from an italic phrase terminated by a colon two lines prior to the table. For example:

```md
[...] which we can see from the average price by article category.

*Average prices by article category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

```md
[...] which we can see from the *Average prices by article category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

#### Table Label Inference

If there's no table label, then a table label will be inferred with these attempts:

1. **column headers** separated by comma, e.g. *Category, Description, Price Avg.*
1. **preceding section heading** (multiple tables without column headers in the same section may be labeled ambiguously)
1. **filename** in which the table has been found.

### Arbitrary Lists of Anything

> **Since v3.5.0**

Since version 3.5.0 you can generate arbitrary *List of `X`*  by using
HTML anchors and CSS classes to categorize them. For example, instead of using `listOfTables` you could now also create a *List of Tables* by placing an
anchor near a table...

```md
<a class="table" id="table-1" title="Average prices by article category" />
| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

... and using the configuration:

```json
"generateFiles": {
    "listOf": [
       { "class": "table", "file": "./tables.md", "title": "List of Tables" }
    ]
}
```

The advantage over `listOfTables` is that due to the HTML anchor element links in the generated list of tables can directly point to the anchor position rather than the closest section heading. And of course by using arbitrary CSS classes for your anchors you are able to create any lists you like, e.g. *List of Listings*, *List of Rules*, etc.

## Options

### `--help` | `--h`

Show all options and default values.

### `--baseUrl` | `--b`

- **Range:** `string`

URL to prepend to links. Only effective with `linking: "absolute"`.
In most situations, e.g. when hosting markdown files in a repository or
processing markdown files with an MD to HTML converter omitting a pre-defined
`baseUrl` and using `linking: "relative"` is likely to work better.

### `--baseDir` | `--d`

- **Range:** `string`

Path to directory where to search for the glossary and markdown files. All paths in a config file will be relative to *baseDir*. *baseDir* itself is relative to the location of the config file or relative to the *current working directory* when provided via command line. Default is `./src`

### `--excludeFiles` | `--e`

- **Range:** `string[]`

Paths or Glob-Patterns of files to exclude. Use `keepRawFiles` if you just
want to ignore certain markdown files from being modified.

### `--experimentalFootnotes`

- **Range:** `boolean`

Enable support for markdown footnote syntax as defined at https://pandoc.org/MANUAL.html#footnotes. Footnotes will be considered an *experimental* feature until they become official part of the CommonMark Specification at https://spec.commonmark.org.

### `generateFiles.indexFile`

- **Range:** `{file: string, [title: string]} | string`
- **Since:** v3.0.0

If available, generates an index of glossary terms with links to files in which they have been mentioned. See section [Additional Features](https://github.com/about-code/glossarify-md#index-of-terms-and-where-they-have-been-used) for a configuration example.

> **Important:** The `string` value range is *deprecated*. It will be kept throughout all versions of v3.x but is eventually going to be removed. Please use the object value range as shown in the example.

### `generateFiles.listOfFigures`

- **Range:** `{file: string, [title: string]}`
- **Since:** v3.3.0

If available, generates a list of figures with links to sections where the figures have been mentioned. See section [Additional Features](https://github.com/about-code/glossarify-md#list-of-figures) for a configuration example.

### `generateFiles.listOfTables`

- **Range:** `{file: string, [title: string]}`
- **Since:** v3.4.0

If available, generates a list of tables. See section [Additional Features](https://github.com/about-code/glossarify-md#list-of-tables) for a configuration example.

### `generateFiles.listOf`

- **Range:** `Array<{class: string, file: string, [title: string]}>`
- **Since:** v3.5.0

If available, generates a list from HTML anchors exposing a CSS class declared in the list's `class` attribute. See section [Additional Features](https://github.com/about-code/glossarify-md#arbitrary-lists-of-anything) for a configuration example.

### `glossaries`

- **Range:** `Array<{file: string, [termHint: string]}>`

A list of glossary configuations, each with a path to the glossary file. Every
glossary may have an optional *termHint*. A *termHint* is a symbol character
being appended to term occurrences in order to indicate which glossary or
category a term belongs to. A term hint may be any UTF-8 character or character
sequence.

### `--ignoreCase` | `--i`

- **Range:** `boolean`

When true any occurrence of a term will be linked no matter how it was spelled.

### `--includeFiles` | `--f`

- **Range:** `string[]`

Paths or Glob-Patterns for files to include.

### `indexing.groupByHeadingDepth`

- **Range:** `number` in [1-6]
- **Since:** v3.4.0

This option affects outputs generated with `generateFiles`. By default when
indexing terms and markdown elements they are being grouped by the heading of
the section they've been found in. In larger books with a lot of sections and
subsections this can lead to *Index* files or *Tables of X* to be generated with
lots of low-level sections and much detail. Yet sometimes it may be preferable
to only list the book chapter or high-level sections which some element has been
found in. This option allows to set the depth by which indexed elements shall be
grouped where `1` refers to chapters (`#` headings). Note that grouping by
high-level sections doesn't mean that only links to the high-level sections are
generated. Where it makes sense links to low-level sections of occurrence are
just being shortened.

### `--keepRawFiles` | `--r`

- **Range:** `string[]`

Paths or Glob-Patterns for (markdown) files to copy to `outDir` but ignore in
glossarification and linking. Non-markdown files will always be kept as is so no
need to add those.

### `--linking` | `--l`

- **Range:** `"relative" | "absolute"`

Whether to create absolute or relative link-urls to the glossary.
The use of `"absolute"` may require a `baseUrl`.

> **Important:** Using `"absolute"` without a `"baseUrl"` will produce an absolute file system path which you might not want to publish.

### `--outDir` | `--o`

- **Range:** `string`

The directory where to write output files to.

> **Important:** using `.` or `./` is going to overwrite your input files. Only do this on a copy of your input
files or if you are able to roll back any changes or if you know the outcome satisfies your needs.

The recommendation is to write outputs to a separate directory such as `../out` or `../tmp`. or `../target`.

### `--outDirDropOld`

- **Range:** `boolean`

If `true` remove old `--outDir` before writing a new one, otherwise overwrite files. Drops orphan files that have intentionally been removed from `--baseDir`.

### `--reportNotMentioned`

- **Range:** `boolean`

Report on terms which exist in a glossary but have neither been mentioned directly nor with any of its aliases.

## Special Thanks go to

- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://github.com/unifiedjs) and [remarkjs](https://github.com/remarkjs) and authors of any other modules adding value to the tool.
