# glossarify-md

A *Term-to-Definition*-Linker for Markdown.

*glossarify-md* is a command line tool to help you link terms in markdown
documents with their definition in another markdown document called *glossary*.

[vuepress](https://vuepress.vuejs.org) users may be interested to learn [how to use the tool with vuepress](https://github.com/about-code/glossarify-md/blob/master/doc/vuepress.md).


## Install

```
npm i -g glossarify-md
```

## Sample

Below we assume a sample project structure like:

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
   +- target/                  (Output directory. Generated.)
   `- glossarify-md.conf.json
```

Your original glossary is a file

*src/glossary.md*
```md
# Glossary

## Glossary Term

A glossary term has a short description. The full description contains both sentences.

## Another Term

and so on...
```

Your original files may just use a term anywhere in text:

*src/pages/page1.md*
```md
# Demo

This is a text which uses a *Glossary Term* to describe something.
```

## Glossarify Command

### ...with command options
```
glossarify-md
  --baseDir "./src"
  --outDir "../target"
  --linking "relative"
  --includeFiles ["."]
  --excludeFiles ["node_modules"]
```

### ...with config file

```
glossarify-md --config ./glossarify-md.conf.json
```

*glossarify-md.conf.json*
```json
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf.schema.json",
  "baseDir": "./src",
  "outDir": "../target",
  "glossaries": [
    { "file": "./glossary.md",  "termHint": "↴" },
    { "file": "./citations.md", "termHint": "Ⓒ"  }
  ],
  "includeFiles": ["."],
  "excludeFiles": ["node_modules"],
  "linking": "relative",
  "baseUrl": ""
}
```
<!-- baseUrl only effective with linking "absolute" -->
As you can see it's possible to have multiple glossary files. Multiple glossaries can be very valuable in professional writing or documentation. For example in specification documents you often want to have an index of particular specification rules. In text you often need to refer to those rules. Collect all those rules in a "glossary", then whenever you refer to them e.g. by "RULE-1", "RULE-2", etc. you'll get a link to the rule.

Glossaries can be associated with *term hints*. A term hint will be visible as an appendix to a term occurrence and can be used to indicate that a particular term and link refers to a glossary term. They can also be used to highlight which glossary a term belongs to.

> **Since v2.0.0**: If you need more control about placement of a term hint, you can use `${term}` as a placeholder in term hints. For example, `☛ ${term}` adds `☛ ` in front of the term.

## Result

Terms in glossaries have been augmented with anchor links.

*./target/glossary.md*:

```md
# Glossary

## [Glossary Term](#glossary-term)

A glossary term has a short description. The full description contains both sentences.

## [Another Term](#another-term)

and so on...
```
Most occurrences of a term have been replaced with a link to its glossary definition. Some syntactic positions are **excluded** from being linkified. These are
  - Headlines
  - Blockquotes
  - Preformatted blocks
  - Existing (markdown) links. There's currently no way to exclude text between HTML `<a></a>`-links.

*./target/pages/page1.md*
```md
# Demo

This is a text which uses a *[Glossary Term ↴][1]* to describe something.

[1]: ../glossary.md#glossary-term "A glossary term has a short description."
```

## Options

### `--help` | `--h`

Show all options and default values.

### `--baseUrl` | `--b`

- **Range:** string

URL to prepend to links. Only effective with `linking: "absolute"`.
In most situations, e.g. when hosting markdown files in a repository or
processing markdown files with an MD to HTML converter omitting a pre-defined
`baseUrl` and using `linking: "relative"` is likely to work better.

### `--baseDir` | `--d`

- **Range:** string

Path to directory where to search for the glossary and markdown files. All paths in a config file will be relative to *baseDir*. *baseDir* itself is relative to the location of the config file or relative to the *current working directory* when provided via command line. Default is `./src`

### `--excludeFiles` | `--e`

- **Range:** string[]

Paths or Glob-Patterns of files to exclude. Use `keepRawFiles` if you just
want to ignore certain markdown files from being modified.

### `--experimentalFootnotes`

Enable support for markdown footnote syntax as defined at https://pandoc.org/MANUAL.html#footnotes. Footnotes will be considered an *experimental* feature until they become official part of the CommonMark Specification at https://spec.commonmark.org.

### `--generateFiles.indexFile`

- **Range:** string | { file: string, [title: string]}
- **Since:** v3.0.0

If available, generates an index of glossary terms with links to files in which they have been mentioned.

*Configuration example*
```
[...]
"generateFiles": {
  "indexFile": {
    "file": "./book-index.md",  // Path relative to `outDir` where to write an index file to.
    "title": "Book Index"       // Title for the generated page. If missing the example value will be the default.
  }
}
```

### `--glossaries`

- **Range:** Array&lt;{file: string, [termHint: string]}&gt;

A list of glossary configuations, each with a path to the glossary file. Every
glossary may have an optional *termHint*. A *termHint* is a symbol character
being appended to term occurrences in order to indicate which glossary or
category a term belongs to. A term hint may be any UTF-8 character or character
sequence.

### `--ignoreCase` | `--i`

- **Range:** boolean

When true any occurrence of a term will be linked no matter how it was spelled.

### `--includeFiles` | `--f`

- **Range:** string[]

Paths or Glob-Patterns for files to include.

### `--keepRawFiles` | `--r`

- **Range:** string[]

Paths or Glob-Patterns for (markdown) files to copy to `outDir` but ignore in glossarification and linking. Non-markdown files will always be kept as is so no need to add those.

### `--linking` | `--l`

- **Range:** "relative" | "absolute",

Whether to create absolute or relative link-urls to the glossary.
The use of `"absolute"` may require a `baseUrl`.

> **Important:** Using `"absolute"` without a `"baseUrl"` will produce an absolute file system path which you might not want to publish.

### `--outDir` | `--o`

- **Range:** "string"

The directory where to write output files to.

> **Important:** using `.` or `./` is going to overwrite your input files. Only do this on a copy of your input
files or if you are able to roll back any changes or if you know the outcome satisfies your needs.

The recommendation is to write outputs to a separate directory such as `../out` or `../tmp`. or `../target`.

- ### `--reportNotMentioned`

- **Range:** "boolean"

Report on terms which exist in a glossary but have neither been mentioned directly nor with any of its aliases.

## Additional Features

### Aliases and Synonyms

Aliases can be defined in an HTML comment with the keyword `Aliases:` followed by a comma-separated list of alternative terms.

*glossary.md*
```md
# Glossary

## Cat
<!--
Aliases: Cats, Wildcat, House Cat
-->
Cats are cute, ...dogs are loyal.
```

Linking aliases to their related term:

*./target/pages/page2.md*
```md
# About Cats

[Cats](./glossary.md#cat) and kitten almost hidden spotting mouses in their houses. [The Author]
```

### Index of terms and where they have been used

> **Since v3.0.0**

Just add the following option with your preferred file name and location to your *glossarify-md.conf.json*:

```json
{
    "generateFiles": {
        "indexFile": "./book-index.md"
    },
}
```

## Special Thanks go to

- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://github.com/unifiedjs) and [remarkjs](https://github.com/remarkjs) and authors of any other modules adding value to the tool.
