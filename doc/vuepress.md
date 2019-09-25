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

> **Tip:** You are free to choose a different structure, e.g. with `.vuepress/` or `images/` being siblings *next to* `baseDir` rather than children of it. This reduces the number of files being copied from `baseDir` to `outDir` and could improve build times if there are many static assets. Relative paths just become a bit longer.

## Configure *glossarify-md*

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

## Configure *vuepress*

*vuepress* and *glossarify-md* use different "slug" algorithms to create friendly anchor links and URL fragments. When *vuepress* translates the glossarified
markdown into HTML it may slugifies anchor names once again *differently* by default.
This can break glossary links. While they still point to the glossary they may fail to address the section with the term definition. This is
particularly the case for terms with non-ASCII unicode characters, e.g for terms
with German *Umlauts* (äöüß), French *accent* or Chinese *symbols*
(see [Issue #27](https://github.com/about-code/glossarify-md/issues/#27)).

Fortunately *vuepress* allows for replacing their default slug algorithm. So we can configure vuepress to use the same slugger also used by *glossarify-md*:

*.vuepress/config.js*
```js
const glossarify = require("glossarify-md");
module.exports = {
    title: 'Hello VuePress',
    markdown: {
      slugify: glossarify.getSlugger()
    }
    /*,themeConfig: { ... } */
};
```
> **Important**: Changing the slugger *may* need to be considered a
> *BREAKING CHANGE* to your docs since URL fragments following the hash #
> change. Bookmarks of your readers still point to the correct page but may no
> longer address the correct page section. It's up to you to decide how important
> this is to you.

## Configure Build Scripts

*package.json*
```json

"scripts": {
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "start": "vuepress dev src",
  "glossarified": "npm run glossarify && vuepress dev target",
  "build": "npm run glossarify && vuepress build target",
}
```
- `npm start` builds and serves files from `src/` with *live-reload*. This is
what you probably want while writing. Since glossarified sources are written to
a separate `target/` directory you won't see glossary terms linked in this build mode.

- `npm run glossarified` builds and serves the glossarified version from `target/` output directory. No live-reload if `src/` changes.

- `npm run build` just builds the glossarified version.

More information see [README.md](../README.md).
