# glossarify-md

![Tests (Functional)](https://github.com/about-code/glossarify-md/workflows/Tests%20\(Functional\)/badge.svg)
![Nightly Tests (Latest Dependencies)](https://github.com/about-code/glossarify-md/workflows/Tests%20\(with%20latest%20deps\)/badge.svg)

[CommonMark]: https://www.commonmark.org

[doc-config]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[doc-cross-linking]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md

[doc-extended]: https://github.com/about-code/glossarify-md/blob/master/doc/README.md

[doc-options]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[doc-paths-and-urls]: https://github.com/about-code/glossarify-md/blob/master/doc/paths-and-urls.md

[doc-syntax-extensions]: https://github.com/about-code/glossarify-md/blob/master/doc/markdown-syntax-extensions.md

[doc-term-attributes]: https://github.com/about-code/glossarify-md/blob/master/doc/term-attributes.md

[doc-vocabulary-uris]: https://github.com/about-code/glossarify-md/blob/master/doc/vocabulary-uris.md

[doc-vuepress]: https://github.com/about-code/glossarify-md/blob/master/doc/use-with-vuepress.md

[GFM]: https://github.github.com/gfm/

[glob]: https://github.com/isaacs/node-glob#glob-primer

[glossarify-md]: https://github.com/about-code/glossarify-md

[Hugo]: https://gohugo.io

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

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Configuration](#configuration)
- [Sample](#sample)
- [What's not Linked](#whats-not-linked)
- [Aliases and Synonyms](#aliases-and-synonyms)
- [Term Hints](#term-hints)
- [Multiple Glossaries](#multiple-glossaries)
- [Sorting Glossaries](#sorting-glossaries)
- [Advanced Topics](#advanced-topics)
- [Node Support Matrix](#node-support-matrix)
- [Special Thanks go to](#special-thanks-go-to)
- [License](#license)

## Prerequisites

- [node.js with npm](https://nodejs.org)

## Install

#### Option 1: Install *locally*, init, configure, run (recommended):

```
cd ./your-project
npm install glossarify-md

npx glossarify-md --init --new --local
npx glossarify-md --config ./glossarify-md.conf.json
```

> **ⓘ Since 6.3.0** glossarify-md supports a `--watch` mode.

When installing locally you might want to set up a shortcut by adding a run script to your `package.json`:

```json
{
  "scripts": {
    "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
  }
}
```

Now use:

```
npm run glossarify
```

#### Option 2: Install *globally*, init, configure, run:

```
npm install -g glossarify-md

glossarify-md --init --new
glossarify-md --config ./glossarify-md.conf.json
```

## Configuration

If you've followed the installation instructions you are already set up for a quick start with a minimal configuration.

*Minimal Configuration*

```json
{
  "$schema": "./conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified",
  "glossaries": [
    { "file": "./glossary.md" }
  ]
}
```

For customizing your configuration **[see more options here][doc-config]**.

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

> **ⓘ Tip:**  Wrap a word into some pseudo HTML tag like e.g. `<x>word</x>` to mark a word for exclusion from [term-based auto-linking][doc-cross-linking].

## Aliases and Synonyms

[alias]: #aliases-and-synonyms

[aliases]: #aliases-and-synonyms

Aliases can be added by what we call [*term attributes*][doc-term-attributes]. Term attributes are provided in a [YAML] formatted comment following a term's heading. For aliases there's the term attribute `aliases` whose attribute value is a string of comma-separated synonyms:

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

> **ⓘ Note:** [YAML] syntax is *case-sensitive* as well as *sensitive to tabs and whitespaces*. In general term attributes will be lowercase.

That's all you need to know for a quick start. Continue reading to learn about additional features.

## Term Hints

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file": "./glossary.md", "termHint": "↴"},
]
```

Glossaries can be associated with *term hints*. Term hints may be used to indicate that a link refers to a glossary term and in case of [multiple glossaries][multiple-glossaries] to which one. Use `"${term}"` to control placement of a `termHint`. For example, `"☛ ${term}"` puts the symbol `☛` in front of a linkified term occurrence.

> **ⓘ Since v5.0.0**: `file` can also be used with a [glob] pattern. More see [Cross-Linking][doc-cross-linking].

## Multiple Glossaries

[multiple-glossaries]: #multiple-glossaries

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

The `i18n` object is passed *as is* to the collator function. Thus you can use additional options documented on [Mozilla Developer Portal](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Collator):

## [Advanced Topics][doc-extended]

- Importing and exporting terms
- Cross-Linking more than just terms
- Generating book index and lists of figures, etc.
- Using glossarify-md with other tools, like [vuepress], [pandoc] or [Hugo]
- Dealing with Non-standard Markdown Syntax via Plug-ins (e.g Frontmatter)
- [...and more][doc-extended]

## Node Support Matrix

The term *support* refers to *runs on the given platform* and is subject to the terms and conditions in [LICENSE](#license).

| NodeJS  | glossarify-md |                                                                           Current Test Matrix                                                                            |
| ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Current | v6+           | Tested. Should node.js introduce breaking changes which affect [glossarify-md], then we may choose to step back from supporting *Current* until it becomes the next LTS. |
| 16 LTS  | v5, v6+       | Tested + Supported                                                                                                                                                       |
| 14 LTS  | v4, v5, v6+   | Tested + Supported                                                                                                                                                       |
| 12 LTS  | v3, v4, v5    |                                                                                                                                                                          |
| 10 LTS  | v2, v3, v4    |                                                                                                                                                                          |

## Special Thanks go to

- [John Gruber](https://daringfireball.net/projects/markdown/), author of the Markdown syntax
- [John MacFarlane  et al.](https://github.com/commonmark-spec), initiators and authors of the CommonMark specification
- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://unifiedjs.com/), [remarkjs](https://github.com/remarkjs) and many more
- and all the other great people publishing modules of value to the tool - directly or transitively.

## License

[MIT](LICENSE) © [Andreas Martin](https://github.com/about-code)
