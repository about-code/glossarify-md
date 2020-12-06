# Using *glossarify-md* with [vuepress](https://vuepress.vuejs.org)

Below we assume a *sample* project structure like this:

```
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
```

## Install into your project

```
npm i --save glossarify-md
```

## Configure *glossarify-md*

*glossarify-md.conf.json*
```json
{
    "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
    "baseDir": "./docs",
    "outDir": "../docs-glossarified",
    "glossaries": [
        { "file": "./glossary.md", "termHint": "↴"},
    ]
}
```

> **Notes**
>
> ☛ All relative paths inside the config file are being interpreted
> relativ to `baseDir` except for `$schema` which is relative to the config file.

## Configure *vuepress*

More details on the reasoning behind changing vuepress's own slug algorithm can
be found in [Appendix](#appendix).

*.vuepress/config.js*
```js
const glossarify = require("glossarify-md");
module.exports = {
    /* ... */
    markdown: {
      slugify: glossarify.getSlugger()
    }
};
```

> **Notes**
>
> ⚠ Changing the slug algorithm could be a **breaking change** for published docs. URLs or URL fragments could change. Bookmarks of your readers may no longer work as expected. If this is important to you or your readers verify the outcome carefully before you publish your changes.
>
> ⚠ For headings with unicode characters, e.g. `# Äquator` *vuepress* generates HTML anchors with *ASCII* characters which you'd refer to by links `[Äquator](#aquator)`. *glossarify-md* allows unicode characters in fragments and requires you to refer to the same heading by `[Äquator](#äquator)` so by a fragment beginning with #**ä**.

## Configure Build Scripts

*package.json*
```json

"scripts": {
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "start": "vuepress dev docs",
  "glossarified": "npm run glossarify && vuepress dev docs-glossarified",
  "build": "npm run glossarify && vuepress build docs-glossarified",
}
```
- `npm start` builds and serves files from `docs/` with *live-reload*. This is
what you probably want while writing. Since glossarified sources are written to
a separate `glossarified/` directory you won't see glossary terms linked in this build mode.

- `npm run glossarified` builds and serves the glossarified version from `glossarified/` output directory. No live-reload if `docs/` changes.

- `npm run build` just builds the glossarified version.

More information see [README.md](../README.md).



## Appendix

### Why glossarify-md requires vuepress to use its own slugger

*glossarify-md* uses a slug algorithms to create friendly URL fragments (#...) for section links. When *vuepress* translates *glossarified markdown* to HTML it does the same once again for the same purpose. If both tools use different slug algorithms this implies the risk of generating different fragments which eventually breaks glossary links ([about-code/glossarify-md#27](https://github.com/about-code/glossarify-md/issues/27)).

Fortunately *vuepress* allows us to configure it to use the same slugger as *glossarify-md*.

> **☛ Note:** If you decide to drop *glossarify-md* later you might not want to have slugs change again. *glossarify-md* uses [github-slugger](https://npmjs.com/package/github-slugger) internally. You can use it directly like so:
>
>  *.vuepress/config.js*
>  ```js
>   const GitHubSlugger = require("github-slugger");
>   module.exports = {
>       /* ... */
>       markdown: {
>         slugify: (value) => {
>           const slugifier = new GitHubSlugger();
>           return slugifier.slug(value);
>         }
>       }
>   };
>  ```
