# glossarify-md

A *Term-to-Definition*-Linker for Markdown.

## Install

```
npm i -g https://github.com/about-code/glossarify-md
```

## Sample

Below we assume a sample project structure like:
```
|- files/
|    |- file1.md
|    |- file2.md
|    |- more/
|        |- file3.md
|
|- glossary.md
|- glossarify-md.conf.json
```

Your original glossary is a file

*glossary.md*
```md
# Glossary

## Glossary Term

A glossary term has a short description. The full description contains both sentences.

## Another Term

and so on...
```

Your original files may just use a term anywhere in text:

*file1.md*
```md
# Demo for a Glossary Term

This is a text which uses a Glossary Term to describe something.
```

## Glossarify Command

### ...with default values

```
glossarify-md
```

### ...with command options
```
glossarify-md
  --baseDir "."
  --outDir "./out"
  --linking "relative"
  --includeFiles ["."]
  --excludeFiles ["node_modules"]
```

### ...with config file

```
glossarify-md --config ./glossarify-md.conf.json
```

*glossarify-md.conf.json*  (sample with default values)
```json
{
  "$schema": "./node_modules/glossarify-md/conf.schema.json",
  "baseDir": ".",
  "outDir": "./out",
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

> **Note:** Currently a particular term can only be linked to a single definition. This might be subject to change in a future version (but don't nail me on this).

## Result

Terms in glossaries have been augmented with anchor links.

*./out/glossary.md*:

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
  - Existing (markdown) links. There's currently no way to exclude text between HTML `<a></a>`-links.

*./out/files/file1.md*
```md
# Demo for a Glossary Term

This is a text which uses a [Glossary Term ↴](../glossary.md#glossary-term) to describe something.
```


## Options

### `--baseUrl` | `--b`

- **Range:** string

URL to prepend to links. Only effective with `linking: "absolute"`.
In most situations, e.g. when hosting markdown files in a repository or
processing markdown files with an MD to HTML converter,`linking: "relative"`
should be the better option.

### `--baseDir` | `--d`

- **Range:** string

Path to directory where to search for the glossary file and markdown files. All paths in a config file will be relative to *baseDir*. *baseDir* itself is relative to the location of the config file or relative to the *current working directory* when provided via command line. Default is `./`

### `--excludeFiles` | `--e`

- **Range:** string[]

Paths or Glob-Patterns of files to exclude.

### `--glossaries`

- **Range:** Array&lt;{file: string, [termHint: string]}&gt;

A list of glossary configuations, each with a path to the glossary file. Every
glossary may have an optional*termHint*. A *termHint* is a symbol character
being appended to term occurrences in order to indicate which glossary or
category a term belongs to. A term hint may be any UTF-8 character or character
sequence.

### `--ignoreCase` | `--i`

- **Range:** boolean

When true any occurrence of a term will be linked no matter how it was spelled.

### `--includeFiles` | `--f`

- **Range:** string[]

Paths or Glob-Patterns for files to include. Default is `./`

### `--linking` | `--l`

- **Range:** "relative" | "absolute",

Whether to create absolute or relative link-urls to the glossary.
The use of `"absolute"` may require a `baseUrl`.

> **Important:** Using `"absolute"` without a `"baseUrl"` will produce an
absolute file system path which you might not want to publish.

### `--outDir` | `--o`

- **Range:** "string"

The directory where to write output files to.

> **Important:** using `.` or `./`
is going to overwrite your input files. Only do this on a copy of your input
files or if you are able to roll back any changes or if you know the outcome
satisfies your needs.

The recommendation is to write outputs to a separate directory such as `./out`
or `./tmp`. Default is `./tmp`.

## Additional Features

### Aliases and Synonyms

Aliases can be defined in an HTML comment with the keyword `Aliases:` followed by a comma-separated list
 of alternative terms.

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

*./out/files/file1.md*
```md
# About Cats

[Cats](./glossary.md#cat) and Kitten almost hidden spotting mouses in their houses. [The Author]
```

## Special Thanks go to

- [Titus Wormer](https://github.com/wooorm), author of [unifiedjs](https://github.com/unifiedjs) and [remarkjs](https://github.com/remarkjs) and a lot of associated plugins and modules.
