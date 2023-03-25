# glossarify-md

![Tests (Functional)](https://github.com/about-code/glossarify-md/workflows/Tests%20(Functional)/badge.svg)
![Nightly Tests (Latest Dependencies)](https://github.com/about-code/glossarify-md/workflows/Tests%20(with%20latest%20deps)/badge.svg)

[doc-paths-and-urls]: https://github.com/about-code/glossarify-md/blob/master/doc/paths-and-urls.md
[doc-vocabulary-uris]: https://github.com/about-code/glossarify-md/blob/master/doc/vocabulary-uris.md
[doc-vuepress]: https://github.com/about-code/glossarify-md/blob/master/doc/use-with-vuepress.md
[doc-syntax-extensions]: https://github.com/about-code/glossarify-md/blob/master/doc/markdown-syntax-extensions.md
[doc-config]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md
[doc-extended]: https://github.com/about-code/blob/master/doc/README.md
[CommonMark]: https://www.commonmark.org
[GFM]: https://github.github.com/gfm/
[glob]: https://github.com/isaacs/node-glob#glob-primer
[glossarify-md]: https://github.com/about-code/glossarify-md
[link reference definitions]: https://spec.commonmark.org/0.30/#link-reference-definition
[pandoc]: https://pandoc.org
[pandoc-heading-ids]: https://pandoc.org/MANUAL.html#heading-identifiers
[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md
[vuepress]: https://vuepress.vuejs.org
[YAML]: https://yaml.org

[glossarify-md] is a command line tool to help Markdown writers with

- **Cross-Linking** (primary use case): autolink terms to some definition in a glossary
- **Indexes**: generate indexes from glossary terms and navigate to where they were mentioned
- **Lists**: generate arbitrary lists such as *List of Tables*, *List of Figures*, *List of Listings*, *List of Definitions*, *List of Formulas*, and so forth...

[vuepress] users might be interested in learning [how to use the tool with vuepress][doc-vuepress].

## Table of Contents

## Prerequisites

- [node.js with npm](https://nodejs.org)

## Install

#### Option 1: Install *locally*, init, configure, run (recommended):

~~~
cd ./your-project
npm install glossarify-md

npx glossarify-md --init --new --local
npx glossarify-md --config ./glossarify-md.conf.json
~~~

> **ⓘ Since 6.3.0** glossarify-md supports a `--watch` mode.


When installing locally you might want to set up a shortcut by adding a run script to your `package.json`:

~~~json
{
  "scripts": {
    "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
  }
}
~~~

Now use:

~~~
npm run glossarify
~~~

#### Option 2: Install *globally*, init, configure, run:

~~~
npm install -g glossarify-md

glossarify-md --init --new
glossarify-md --config ./glossarify-md.conf.json
~~~

## Configuration

If you've followed the installation instructions you are already set up for a quick start. For customizing your configuration **[see here][doc-config]**.

## Sample

[Sample]:#sample

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

~~~
npx glossarify-md --config ./glossarify-md.conf.json
~~~

**Output Results**

Augmented versions of the source files have been written to the output directory:

*./docs-glossarified/pages/page1.md*
```md
# [Demo](#demo)

This is a text which uses a glossary [Term][1] to describe something.

[1]: ../glossary.md#term "A glossary term has a short description."
```

*Rendered as HTML:*

> ## [Demo](#demo)
>
> This is a text which uses a glossary [Term][1] to describe something.
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

Blockquotes are excluded based on the premise that a quoted entity may not share the same definition of a term like the entity who quotes it.

> **ⓘ Tip:**  Wrap a word into some pseudo HTML tag like e.g. `<x>word</x>` to mark a word for exclusion from [term-based auto-linking][cross-linking].

## Aliases and Synonyms

[alias]: #aliases-and-synonyms
[aliases]: #aliases-and-synonyms
[term-attributes]: #aliases-and-synonyms

Aliases can be added by what we call *term attributes*. Term attributes are provided in a [YAML] formatted comment following a term's heading. For aliases there's the term attribute `aliases` whose attribute value is a string of comma-separated synonyms:

*glossary.md with a term attribute `aliases`:*
```md
# Glossary

## Cat
<!-- aliases: Cats, Wildcat, House Cat -->
Cats are cute, ...dogs are loyal.
```

In the output files aliases will be linked to their related term:

*./docs-glossarified/pages/page2.md*

```md
# About Cats

[Cats](./glossary.md#cat) and kitten almost hidden spotting mouses in their houses. [Andreas Martin]
```

> **ⓘ Note:** [YAML] syntax is *case-sensitive* as well as *sensitive to tabs and whitespaces*. In general term attributes will be lowercase. You may find that an uppercase `Aliases: ` term attribute works as well. This is going to be the only attribute for which an uppercase name remains supported *for backwards compatibility*.

That's all you need to know for a quick start. Continue reading to learn about additional features.

## Term Hints

*glossarify-md.conf.json*
```json
"glossaries": [
    { "file": "./glossary.md", "termHint": "↴"},
]
```

Glossaries can be associated with *term hints*. Term hints may be used to indicate that a link refers to a glossary term and in case of [multiple glossaries][multiple-glossaries] to which one. Use `"${term}"` to control placement of a `termHint`. For example, `"☛ ${term}"` puts the symbol `☛` in front of a linkified term occurrence.

> **ⓘ Since v5.0.0**: `file` can also be used with a [glob] pattern. More see [Cross-Linking].

## Multiple Glossaries

[multiple-glossaries]:#multiple-glossaries

Sometimes you might whish to have multiple glossaries. For example as a Requirements Engineer you may not just have a glossary of business terms but also a requirements catalogue:

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file": "./glossary.md",  "termHint": "↴" },
    { "file": "./requirements.md", "termHint": "☛" }
]
```

*requirements.md*

```md
## REQ-1: The system MUST provide service X
<!-- aliases: REQ-1 -->

## REQ-2: The system MAY provide service Y
<!-- aliases: REQ-2 -->
```

By adding *requirements.md* to the list of glossaries every use of *REQ-1* or *REQ-2* in documents gets linked to the requirements glossary. To navigate the opposite direction from a requirement to sections where those got mentioned you can generate a [Book Index](#book-index).

## Sorting Glossaries

Add `sort` with `"asc"` (ascending) or `"desc"` (descending) to glossaries you want [glossarify-md] sort for you:

*glossarify-md.conf.json*
```json
"glossaries": [
    { "file":"./glossary.md", "sort": "asc" }
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



## Advanced Topics

- Generating files
- Using glossarify-md with other tools
- Importing and exporting terms
- Dealing with non-standard Markdown Syntax via Plug-ins (e.g Frontmatter)
- ...and [more][doc-extended]



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
~~~
{
  indexFile: {},
  listOf: [],
  listOfFigures: {},
  listOfTables: {}
}
~~~

#### `generateFiles.indexFile`

[doc-config-indexFile]: https://github.com/about-code/glossarify-md/blob/master/conf/v5/doc/schema-defs-generatefiles-properties-indexfile.md

- **Range:** `{file: string, [title: string], [hideDeepLinks: boolean]}` ([details][doc-config-indexFile])
- **Since:** v3.0.0

Generates an index of glossary terms with links to files in which they have been mentioned.

#### `generateFiles.indexFiles`

[doc-config-indexFiles]: https://github.com/about-code/glossarify-md/blob/master/conf/v5/doc/schema-defs-generatefiles-properties-indexfiles-items.md

- **Range:** `Array<{file: string, glossary: string, [title: string], [hideDeepLinks: boolean]}>` ([details][doc-config-indexFiles])
- **Since:** v3.0.0

Similar to `indexFile` but allows for generating multiple index files, e.g. one per glossary.

#### `generateFiles.listOf`

[doc-config-listOf]: https://github.com/about-code/glossarify-md/blob/master/conf/v5/doc/schema-defs-generatefiles-properties-listof-items.md

- **Range:** `Array<{class: string, file: string, [title: string]}>` ([details][doc-config-listof])
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
~~~
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
~~~
- **Default:** `[{ "file": "./glossary.md", "termHint": "" }]`

A list of glossary configuations, each with a path to the glossary file. Every
glossary may have an optional *termHint*. A *termHint* is a symbol character
being appended to term occurrences in order to indicate which glossary or
category a term belongs to. A term hint may be any UTF-8 character or character
sequence. If you would like to have the glossary sorted provide a *sort* direction
`"asc"` or `"desc"`.

#### `glossaries[].export`

[doc-config-export]: https://github.com/about-code/glossarify-md/blob/master/conf/v5/doc/schema-defs-glossaryfile-properties-export-oneof-0.md

- **Range:** `{ file: string [, context: string]} | Array<{ file: string [, context: string]}>` ([details][doc-config-export])
- **Since:** v6.0.0

Export markdown terms in a structured JSON format. More read [here][doc-export-import].

#### `glossaries[].import`

[doc-config-import]: https://github.com/about-code/glossarify-md/blob/master/conf/v5/doc/schema-defs-glossaryfile-properties-import.md

- **Range:** `{ file: string [, context: string]}` ([details][doc-config-import])
- **Since:** v6.0.0

Import terms from a structured JSON format and generate a markdown glossary from it. For an example see [here][doc-export-import].

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
~~~
{
  headingDepths: number[],
  groupByHeadingDepth: number,
}
~~~

#### `indexing.groupByHeadingDepth`

- **Range:** `number` in [1-6]
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
~~~
{
  locale: string,
  [localeMatcher: string],
  [caseFirst: string],
  [ignorePunctuation: boolean],
  [numeric: boolean],
  [sensitivity: string],
  [usage: string]
}`
~~~

Locale options to control [sorting](#sorting-glossaries). See [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator).

#### `keepRawFiles`

- **Range:** `string[]`

Paths or Glob-Patterns for Markdown files to copy to `outDir` but keep there as they are without
glossarifying and linking. Non-markdown files won't be processed anyways, so no need to add those.

#### `linking`

- **Range:** `Object`

~~~
{
  baseUrl: string,
  byReferenceDefinition: boolean,
  paths: "relative" | "absolute",
  pathComponents: ["path", "file", "ext"],
  pathRewrites: {},
  mentions: "all" | "first-in-paragraph",
  headingAsLink: boolean,
  headingDepths: number[],
  headingIdAlgorithm: "github" | "md5" | "md5-7" | "sha256" | "sha256-7",
  headingIdPandoc: boolean,
  limitByAlternatives: number
  limitByTermOrigin: ["self", "parent", "sibling", "child", "parent-sibling"]
}
~~~

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

~~~
hash (
  glossary file path,
  glossary file name without file extension,
  glossary uri,
  github-slugger(term),
  baseUrl
)
~~~

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


#### `linking.limitByTermOrigin`

- **Range:** `string[]` in `["self", "parent", "sibling", "child", "parent-sibling"]`
- **Default:** `[]`
- **Since:** v6.1.0

Limits linkification based on the file hierarchy of a book project. For example, `["parent", "sibling", "self"]` causes a term occurrence being linkified only

- when a term has been defined in a glossary in a parent directory (`"parent"`)
- when it has been defined in a glossary next to the document file (`"sibling"`)
- or within the glossary itself (`"self"`).

The option allows for a hierarchy of glossaries e.g. a top-level glossary for common terms linked throughout a book and glossaries whose terms are being linked within a particular (sub-)directory/section branch, only. It may also provide a means of limiting auto-linking when the [`glossaries`](#glossaries) option is used with `file` wildcard patterns. Enumerating all elements is equivalent to keeping the array empty. It will make glossarify-md link each glossary term in every document. Defaults to `[]`.


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

#### `linking.pathRewrites`

- **Range:** `{ [key: string]: string | string[] }`
- **Default:** `{}`
- **Since:** v6.2.0

Key-Value map where *Value* is a single search string or an array of strings or regular expressions (RegExp) and *Key* is the replacement/rewrite string. See also [Paths and Urls][doc-paths-and-urls].

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
- [John MacFarlane  et al.](https://github.com/commonmark-spec), initiators and authors of the CommonMark specification
- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://unifiedjs.com/), [remarkjs](https://github.com/remarkjs) and many more
- and all the other great people publishing modules of value to the tool - directly or transitively.

## License
