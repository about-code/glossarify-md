# Using *glossarify-md* with [vuepress](https://vuepress.vuejs.org)

Below we assume a *sample* project structure like this:

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
   |- glossarify-md.conf.json
   |- package.json
   '- .gitignore
```

> **Tip:** As a matter of choice you may also decide for a different structure with `.vuepress` *next to* `baseDir` rather than being a child of it. This will reduce the number of files being copied from `baseDir` to `outDir`.

## Configure glossarify-md

*glossarify-md.conf.json*
```json
{
    "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf.schema.json",
    "baseDir": "./src",
    "outDir": "../target",
    "includeFiles": ["."],
    "excludeFiles": ["**/*.exclude.md"],
    "keepRawFiles": ["**/*.raw.md"],
    "glossaries": [
        { "file": "./glossary.md", "termHint": "↴"},
    ],
    "linking": "relative",
    "ignoreCase": false
}
```

> **Note:** All relative paths inside the config file are being interpreted
> relativ to `baseDir`.

So we set `outDir` to `../target`. Consider adding your `outDir` to *.gitignore*.

## Build Scripts

*package.json*
```json

"scripts": {
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "start": "vuepress dev src",
  "glossarified": "npm run glossarify && vuepress dev target",
  "build": "npm run glossarify && vuepress build target",
}
```
`npm start` builds and serves files from `src/`. Unfortunately, the preview won't be glossarified but live-reloading your changes to `src/` is likely to be more important to you when writing.

`npm run glossarified` serves a glossarified preview from `target/`.

More information see [README.md](../README.md).
