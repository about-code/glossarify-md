# Using glossarify-md with pandoc

[pandoc]: https://pandoc.org

~~~
${root}
   +- docs/
   |   +- .vuepress/
   |   |   |- public/
   |   |   '- config.js
   |   |
   |   +- images/
   |   |   '...
   |   +- section-1/
   |   |   |- page-1.md
   |   |   |- page-2.md
   |   |   '- page-3.md
   |   |
   |   '- glossary.md
   |
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
1. `headingIdAlgorithm: "md5"` guarantees heading IDs to be unique accross the
   whole file set and therefore within the merged file
1. `byReferenceDefinition: false` disables link reference definitions and enables
   inline link urls. Reference numbers are not unique, either and would lose
   their referential purpose in a merged file.

Optional

1. `headingAsLink: false` disables linkifying of headings and is
   not required but may come handy, e.g. when translating to a book format.

After having set these options, files can be merged, e.g. with

~~~
pandoc --from=markdown -o out.html ./**/*.md
~~~
