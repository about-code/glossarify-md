# Using glossarify-md with pandoc

[pandoc]: https://pandoc.org

~~~
${root}
   +- docs/
   +- docs-glossarified/           (Generated)
   +- node_modules/
   |- glossarify-md.conf.json
   |- package.json
   '- .gitignore
~~~

## Install into your project

```
npm i --save glossarify-md
```

## Configure glossarify-md

*glossarify-md.conf.json*
~~~json
{
    "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
    "baseDir": "./docs",
    "outDir": "../docs-glossarified",
    "glossaries": [{ "file": "./glossary.md" }],
    "linking": {
        "paths": "none",
        "headingIdPandoc": true,
        "headingIdAlgorithm": "md5-7",
        "byReferenceDefinition": false,
        "headingAsLink": false
    }
}
~~~

When [pandoc] merges multiple files into a single file we need to take care for
link stability and paths.

1. `linking.paths: "none"` disables the use of paths and uses heading ids
   (anchors), only
1. `headingIdPandoc: true` adds pandoc-style `{# foo}` attributes taken by
   pandoc for its own linking
1. `headingIdAlgorithm: "md5"` generates a heading ID based on a hashsum which is
   unique accross the file set and therefore within a pandoc-merged file, too. Other
   values may be `md5-7, sha256, sha256-7`.
1. `byReferenceDefinition: false` disables link reference definitions and enables
   inline link urls. Reference numbers are not unique, either and would lose
   their referential purpose in a pandoc-merged file.

Optional

1. `headingAsLink: false` disables headings being wrapped into links. Linkable
   headings may not required when there is `headingIdPandoc: true`.

After having set these options, files can be merged, e.g. with

~~~
pandoc --from=markdown -o out.html ./docs-glossarified/**/*.md
~~~
