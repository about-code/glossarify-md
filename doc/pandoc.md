# [Using glossarify-md with pandoc](#using-glossarify-md-with-pandoc)

    ${root}
       +- docs/
       +- docs-glossarified/           (Generated)
       +- node_modules/
       |- glossarify-md.conf.json
       |- package.json
       '- .gitignore

## [Install into your project](#install-into-your-project)

    npm i --save glossarify-md

## [Configure glossarify-md](#configure-glossarify-md)

*[glossarify-md⎆][1].conf.json*

```json
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
```

When [pandoc⎆][2] merges multiple files into a single file we need to take care for
link stability and paths.

1.  `linking.paths: "none"` disables the use of paths and uses heading ids
    (anchors), only
2.  `headingIdPandoc: true` adds pandoc-style `{# foo}` attributes taken by
    [pandoc⎆][2] for its own linking
3.  `headingIdAlgorithm: "md5"` generates a heading ID based on a hashsum which is
    unique accross the file set and therefore within a pandoc-merged file, too. Other
    values may be `md5-7, sha256, sha256-7`.
4.  `byReferenceDefinition: false` disables link reference definitions and enables
    inline link urls. Reference numbers are not unique, either and would lose
    their referential purpose in a pandoc-merged file.

Optional

1.  `headingAsLink: false` disables headings being wrapped into links. Linkable
    headings may not required when there is `headingIdPandoc: true`.

After having set these options, files can be merged, e.g. with

    pandoc --from=markdown -o out.html ./docs-glossarified/**/*.md

[1]: https://github.com/about-code/glossarify-md "This project."

[2]: https://pandoc.org "See pandoc."
