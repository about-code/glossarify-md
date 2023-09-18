# [Using glossarify-md with vuepress](#using-glossarify-md-with-vuepress)

<!-- aliases: Use with VuePress -->

[doc-v6]: https://github.com/about-code/glossarify-md/blob/v6.3.3/doc/use-with-vuepress.md#configure-vuepress

[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter

[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers

[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji

[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents

[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks

[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets

[github-slugger]: https://npmjs.com/package/github-slugger

[github-slugger-diff]: https://github.com/Flet/github-slugger/compare/v1.5.0...2.0.0

Below we assume a *sample* project structure like this:

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

## [Install glossarify-md](#install-glossarify-md)

    npm i glossarify-md remark-frontmatter

Installs glossarify-md with a syntax plug-in for *frontmatter* syntax.

## [Configure glossarify-md](#configure-glossarify-md)

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

## [Configure vuepress](#configure-vuepress)

> *   vuepress v1
> *   vuepress v2 (beta 47+)

glossarify-md and [vuepress 🌎][1] need to be aligned in how they create hyperlink URLs with browser-friendly URL-hashes `#...`, also called *[slugs][2]*.

<em>./docs/.vuepress/config.js</em>

```js
import { getSlugger } from "glossarify-md"

module.exports = {
    markdown: {
      slugify: getSlugger()
    }
};
```

> ⚠ **Important (Non-English / Non-ASCII charsets):** vuepress's default slugger creates hashes with lowercase *ASCII characters, only*. [github-slugger] instead maps UNICODE characters onto their lowercase UNICODE equivalent.
> For example, non-ASCII *Äquator* (German) becomes `#aquator` with vuepress defaults but becomes `#äquator` when using vuepress with [github-slugger]. Some consequences to consider:
>
> 1.  Bookmarks onto published web pages continue to resolve to the web page but a browser may no longer resolve the page section and stops scrolling when sections outside the visible viewport.
> 2.  As a Markdown writer you may have authored links `[Foo](#aquator)`, manually, which have to be changed to `[Foo](#äquator)`.

### [Get rid of glossarify-md](#get-rid-of-glossarify-md)

Given you want to get rid of glossarify-md but keep on using [vuepress 🌎][1]. Then you may not want URLs and [URL][3] [slugs][2], to change. To keep them stable while dropping glossarify-md just [import][4] `github-slugger` yourself.

    npm i --save github-slugger@^1.5.0

<em>./docs/.vuepress/config.js</em>

```js
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
```

## [Optional: Configure Run Scripts](#optional-configure-run-scripts)

*package.json*

```json
"scripts": {
  "start": "vuepress dev docs",
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "glossarified": "npm run glossarify && vuepress dev docs-glossarified",
  "build": "npm run glossarify && vuepress build docs-glossarified"
}
```

*   `npm start` builds and serves files quickly from `baseDir` with *live-reload*. This is what you probably want while writing even though it doesn't produce glossarified output.
*   `npm run glossarify` writes glossarified markdown files to `outDir`
*   `npm run glossarified` builds and serves the glossarified version from `outDir`.
*   `npm run build` just builds the glossarified [vuepress 🌎][1] site without running a server.

More see [README.md][5].

[1]: https://vuepress.vuejs.org "A static website generator translating markdown files into a website powered by [vuejs]."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#slug "A slug is a URL-friendly identifier that can be used within URL fragments to address headings / sections on a page."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https, when configured this way."

[5]: ../README.md
