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

## My Term

My Term has a short description. The full description contains both sentences.

## Another Term

and so on...
```

Your original files may just use a term anywhere in text:

*file1.md*
```md
# Demo for My Term

This file shows us My Term.
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
  --outDir "./tmp"
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
  "outDir": "./tmp",
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
As you can see it's possible to have multiple glossary files with individual term hints to denote different kinds of term definitions. Multiple glossaries can be very valuable in professional writing or documentation. Though, currently a term can only be linked to a single definition. This might be subject to change in a future version (but don't nail me on this).

## Result

Terms in glossaries have been augmented with anchor links.

*./tmp/glossary.md*:

```md
# Glossary

## [My Term](#my-term)

My Term has a short description. The full description contains both sentences.

## [Another Term](#another-term)

and so on...
```
Most occurrences of a term have been replaced with a link to its glossary definition. Some syntactic positions are **excluded** from being linkified. These are
  - Headlines
  - Blockquotes
  - Existing (markdown) links. There's currently no way to exclude text between HTML `<a></a>`-links.

*tmp/files/file1.md*
```md
# Demo for My Term

This file shows us [My Term ↴](../glossary.md#my-term).
```

## Notes and Noteworthy

- There's currently no way to manage (update, delete) glossary links and might never be. You might not want to let `--outDir` point to your source files as those would be overridden. Consider glossarification to be a compile step whose outputs should be written to a separate directory. `--outDir` works relative to your "current working directory" (CWD) where you run the CLI from.

