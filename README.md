# glossarify-md

## Install

```
npm i -g glossarify-md
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

## Glossarify

### ...with default values

```
glossarify-md
```

### ...with command options
```
glossarify-md
  --baseDir .
  --glossaryFile "glossary.md"
  --outDir "./tmp"
  --linking "relative"
```

### ...with config file

```
glossarify-md --config ./md-glossary.conf.json
```

*glossarify-md.conf.json*  (sample with default values)
```json
{
    "$schema": "./node_modules/glossarify-md/conf.schema.json",
    "baseDir": ".",
    "glossaryFile": "glossary.md",
    "outDir": "./tmp",
    "linking": "relative",
    "baseUrl": "",
    "termHint": " ↴",
}
```

## Result

*./tmp/glossary.md (extended with anchors)*:

```md
# Glossary

## My Term {#my-term}

My Term has a short description. The full description contains both sentences.

## Another Term {#another-term}

and so on...
```

*tmp/files/file1.md (term occurences in text converted to links)*
```md
# Demo for My Term

This file shows us [My Term ↴](../glossary.md#my-term).
```
