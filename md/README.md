# glossarify-md

![Tests (Functional)](https://github.com/about-code/glossarify-md/workflows/Tests%20(Functional)/badge.svg)
![Nightly Tests (Latest Dependencies)](https://github.com/about-code/glossarify-md/workflows/Tests%20(with%20latest%20deps)/badge.svg)

[CommonMark]: https://www.commonmark.org
[doc-book-index]: https://github.com/about-code/glossarify-md/blob/master/doc/gen-book-index.md
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
[node.js with npm]: https://nodejs.org
[pandoc]: https://pandoc.org
[pandoc-heading-ids]: https://pandoc.org/MANUAL.html#heading-identifiers
[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md
[vuepress]: https://vuepress.vuejs.org
[YAML]: https://yaml.org

[glossarify-md] is a command line tool to help Markdown writers with

- **Cross-Linking** (prime use case): auto-link terms to some definition in a glossary
- **Indexes**: generate indexes from glossary terms and navigate to where they were mentioned
- **Lists**: generate arbitrary lists such as *List of Tables*, *List of Figures*, *List of Listings*, *List of Definitions*, *List of Formulas*, and so forth...


## Table of Contents

## Prerequisites

- [node.js with npm]

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

Next time you're able to use:

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

By following the installation instructions you should be set up with a minimal configuration:

*Minimal Configuration*
~~~json
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
~~~

**[More configuration options here][doc-config]**.

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
   |    |- who-icd-codes.md
   |    `- glossary.md
   |
   +- docs-glossarified/  (Generated output directory)
   `- glossarify-md.conf.json
```

### Input

A term *Term* then may occur anywhere in your file set:

*./docs/pages/page1.md...*
```md
# Document

This is a text mentioning a glossary Term to describe something.
```

Your glossary is a file with terms being section headings and definitions being section content:

*docs/glossary.md*

```md
# Glossary

## Term

A glossary term has a short description. The full description contains both sentences.
```


Then run [glossarify-md] with a [glossarify-md.conf.json](#configuration):

~~~
npx glossarify-md --config ./glossarify-md.conf.json
~~~

### Output

Augmented versions of your input files have been written to the output directory:

*Source: ./docs-glossarified/pages/page1.md*
```md
# [Document](#document)

This is text mentioning a glossary [Term][1] to describe something.

[1]: ../glossary.md#term "A glossary term has a short description."
```


*Source: ./docs-glossarified/glossary.md*:

```md
# [Glossary](#glossary)

## [Term](#term)

A glossary term has a short description. The full description contains both sentences.
```

When rendered by some Markdown to HTML converter (not part of glossarify-md) the result may look like this:

*./docs-glossarified/glossary.html*:

> ## [Glossary](#glossary)
>
> ### [Term](#term)
>
> A glossary term has a short description. The full description contains both sentences.

*./docs-glossarified/pages/page1.html*

> ## [Demo](#demo)
>
> This is text mentioning a glossary [Term][1] to describe something.
>
> [1]: #term "A glossary term has a short description."

To navigate the opposite direction from a term to sections where a glossary term got mentioned you might want to generate a [Book Index][doc-book-index].

## What's not being linkified

Some syntactic positions of a term occurrence are **excluded** from being linked to the glossary, for example when the term occurs in:

- HTML `<a>text</a>`
- Headlines `#`
- (Markdown) links `[]()`
- Preformatted blocks ` ```, ~~~ `
- Blockquotes `>`
  - Blockquotes are excluded based on the premise that a quoted entity may not share the same definition of a term like the entity who quotes it.


> **ⓘ Tip:**  Wrap a word into some pseudo HTML tag like e.g. `<x>word</x>` to mark it for exclusion from [term-based auto-linking][doc-cross-linking].

## Aliases and Synonyms

[alias]: #aliases-and-synonyms
[aliases]: #aliases-and-synonyms

Aliases can be added by what we call [*term attributes*][doc-term-attributes]. Term attributes are provided in a [YAML] formatted comment following a term's heading. For aliases there's the term attribute `aliases` whose attribute value is a string of comma-separated synonyms:

*glossary.md with a term attribute `aliases`:*
```md
# Glossary

## Cat
<!-- aliases: Cats, Wildcat, House Cat, PET-2 -->
Cats are cute, ...dogs are loyal.
```

In the output files aliases will be linked to their related term:

*./docs-glossarified/pages/page2.md*

```md
# About Cats

[Cats](./glossary.md#cat) and kitten almost hidden spotting mouses in their houses. [Andreas Martin]
```

> **ⓘ Note:** [YAML] syntax is *case-sensitive* as well as *sensitive to tabs and whitespaces*. In general term attributes will be lowercase.


## Term Hints

*glossarify-md.conf.json*
```json
"glossaries": [
    { "file": "./glossary.md", "termHint": "↴"},
]
```

Glossaries can be associated with *term hints*. Term hints may be used to indicate that a link refers to a glossary term and in case of [multiple glossaries][multiple-glossaries] to which one. Use `"${term}"` to control placement of a `termHint`. For example, `"☛ ${term}"` puts the symbol `☛` in front of a linkified term occurrence.

## Multiple Glossaries

[multiple-glossaries]:#multiple-glossaries

Sometimes you might whish to have multiple glossaries:

*glossarify-md.conf.json*

```json
"glossaries": [
    { "file": "./glossary.md",   "termHint": "↴" },
    { "file": "./who-icd-codes.md", "termHint": "⚕${term}" }
]
```

*who-icd-codes.md*

```md
## NC32
Fracture of forearm

## NC90
Superficial injury of knee or lower leg

```

With adding *who-icd-codes.md* to the list of glossaries every mention of [⚕NC32](#nc32 "Fracture of forearm") or [⚕NC90](#nc90 "Superficial injury of knee or lower leg") in documents will have a tooltip and link to the glossary definition, too.

> **ⓘ Since v5.0.0** `file` can also be used with a [glob] file pattern. This way each markdown file matching a pattern will be processed like a glossary. More see [Cross-Linking][doc-cross-linking].

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

See **[here][doc-extended]**, for example:

- Importing and exporting terms
- Generating files, such as a book index, lists of figures, etc.
- Cross-Linking more than just terms
- Using glossarify-md with other tools, like [vuepress], [pandoc] or [Hugo]
- Dealing with non-standard Markdown Syntax via Plug-ins (e.g Frontmatter)

## Node Support Matrix

The term *support* refers to *runs on the given platform* and is subject to the terms and conditions in [LICENSE](#license).

| NodeJS  | glossarify-md |                                                                           Current Test Matrix                                                                            |
| ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Current | v7            | Tested. Should node.js introduce breaking changes which affect [glossarify-md], then we may choose to step back from supporting *Current* until it becomes the next LTS. |
| 18 LTS  | v6, v7        | Tested + Supported
| 16 LTS  | v5, v6, v7    | Tested + Supported                                                                                                                                                       |
| 14 LTS  | v4, v5, v6    | |
| 12 LTS  | v3, v4, v5    |                                                                                                                                                                          |
| 10 LTS  | v2, v3, v4    |                                                                                                                                                                          |

## Special Thanks go to

- [John Gruber](https://daringfireball.net/projects/markdown/), author of the Markdown syntax
- [John MacFarlane  et al.](https://github.com/commonmark-spec), initiators and authors of the CommonMark specification
- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://unifiedjs.com/), [remarkjs](https://github.com/remarkjs) and so much more
- All the other great people publishing modules of value for the tool, be it directly or transitively.

## License
