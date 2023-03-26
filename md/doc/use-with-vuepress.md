# Using glossarify-md with vuepress
<!-- aliases: Use with VuePress -->

[doc-v6]: https://github.com/about-code/glossarify-md/blob/v6.3.3/doc/use-with-vuepress.md
[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter
[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers
[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji
[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents
[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks
[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets
[github-slugger]: https://npmjs.com/package/github-slugger
[github-slugger-diff]: https://github.com/Flet/github-slugger/compare/v1.5.0...2.0.0

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

## Install glossarify-md

~~~
npm i glossarify-md remark-frontmatter
~~~

Installs glossarify-md with a syntax plug-in for *frontmatter* syntax.

## Configure glossarify-md

*glossarify-md.conf.json*
```json
{
    "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
    "baseDir": "./docs",
    "outDir": "../docs-glossarified",
    "glossaries": [
        { "file": "./glossary.md", "termHint": "★"},
    ],
    "unified": {
      "plugins": {
        "remark-frontmatter": {
          "marker": "-"
        }
      }
    }
}
```

> **ⓘ Note:** All relative paths inside the config file are being interpreted relativ to `baseDir` except of `$schema` which is relative to the config file.


## Configure vuepress

glossarify-md and vuepress need to be aligned in how they create hyperlink URLs with browser-friendly URL-hashes `#...`, also called *slugs*.


> ⚠ **Important (Non-English / Non-ASCII charsets):** vuepress's default slugger creates hashes with lowercase *ASCII characters, only*. [github-slugger] instead maps UNICODE characters onto their lowercase UNICODE equivalent. 

**Example**: non-ASCII *Äquator* (German) becomes `#aquator` with vuepress defaults but becomes `#äquator` when using vuepress with [github-slugger]. Some consequences to consider:

1. Bookmarks onto published web pages continue to resolve to the web page but a browser may no longer resolve the page section and stops scrolling when sections outside the visible viewport.

2. As a Markdown writer you may have authored links `[Foo](#aquator)`, manually, which have to be changed to `[Foo](#äquator)`.

### vuepress 2.x

<em>./docs/.vuepress/config.js</em>

~~~js
import { getSlugger } from "glossarify-md"

const slugify = {
  slugify: getSlugger()
};
module.exports = {
    markdown: {               // vuepress v2.x
      toc: { ...slugify },
      anchor: { ...slugify },
      extractHeaders: { ...slugify }
    }
};
~~~


### vuepress 1.x

> ⚠ **We recommend [using vuepress 1.x with glossarify-md <= v6, only][doc-v6]**. Using glossarify-md v7 with vuepress 1.x should be possible but requires you to install a CommonJS version of [github-slugger v1][github-slugger] for yourself while glossarify-md uses [github-slugger v2][github-slugger]. Slugs should be compatible, because [github-slugger v1 and v2 still implement the same algorithm][github-slugger-diff] but the mere fact that vuepress and glossarify-md no longer physically execute the same code to generate slugs makes it more likely to break in a future when some major release of glossarify-md starts using a potentially incompatbile [github-slugger v3][github-slugger].  

~~~
npm i --save github-slugger@^1.5.0
~~~

<em>./docs/.vuepress/config.js</em>

~~~js
const GitHubSlugger = require("github-slugger");
const slugify = {
  slugify: (value) => {
      const slugifier = new GitHubSlugger();
      return slugifier.slug(value);
  }
};

module.exports = {
    markdown: { ...slugify }
};
~~~


## Optional: Configure Run Scripts

*package.json*
```json
"scripts": {
  "start": "vuepress dev docs",
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "glossarified": "npm run glossarify && vuepress dev docs-glossarified",
  "build": "npm run glossarify && vuepress build docs-glossarified"
}
```
- `npm start` builds and serves files quickly from `baseDir` with *live-reload*. This is what you probably want while writing even though it doesn't produce glossarified output.
- `npm run glossarify` writes glossarified markdown files to `outDir`
- `npm run glossarified` builds and serves the glossarified version from `outDir`.
- `npm run build` just builds the glossarified vuepress site without running a server.

More see [README.md](../README.md).