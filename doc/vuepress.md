# Using *glossarify-md* with [vuepress](https://vuepress.vuejs.org)

Below we assume a sample project structure like this:

```
${root}
   +- src/
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
   +- target/                  <-- Generated
   |
   |- glossarify-md.conf.json
   |- package.json
   '- .gitignore
```

Add prebuild steps to your *package.json*:

*package.json*
```json

"scripts": {
  "prestart": "npm run glossarify",
  "prebuild": "npm run glossarify",
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "start": "cd ./target && vuepress dev",
  "build": "cd ./target && vuepress build",
}
```

We configure our *glossarify-md.conf.json* to write outputs to *../target*. You *may* add `outDir` to your `.gitignore`. Though, glossary links will also be navigable on GitHub, so this may also be what you
*actually* want to put on GitHub.

> Note that all paths inside the file are being interpreted relativ to `baseDir`, so to write outputs to a sibling directory we need to step out of `baseDir`.

*glossarify-md.conf.json*
```json
{
    "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf.schema.json",
    "baseDir": "./src",
    "outDir": "../target",
    "includeFiles": ["."],
    "excludeFiles": ["**/*exclude*/**"],
    "keepRawFiles": ["**/*.raw.md"],
    "glossaries": [
        { "file": "./glossary.md", "termHint": "↴"},
    ],
    "linking": "relative",
    "ignoreCase": false
}
```
Files in `baseDir` except those in `excludeFiles` will be copied to `outDir`. Relative paths to your assets remain stable.

> In the example any files apart from those in a folder which has *exclude* in its name will be copied.

There might be markdown files which should be part of a vuepress book but
should not be linkified. Those can be listed in `keepRawFiles`. They will be copied but won't be processed. Now run

```
npm run build
```

Any glossary terms defined *glossary.md* and found in
one of the *page* files should now be linked. Mind the [excluded syntactic
positions](../README.md#Result).
