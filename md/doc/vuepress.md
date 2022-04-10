# Using glossarify-md with vuepress

Below we assume a *sample* project structure like this:

[doc-syntax-extensions]: ./markdown-syntax-extensions.md

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

## Configure glossarify-md

*glossarify-md.conf.json*
```json
{
    "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
    "baseDir": "./docs",
    "outDir": "../docs-glossarified",
    "glossaries": [
        { "file": "./glossary.md", "termHint": "🟉"},
    ]
}
```

> **ⓘ Note:** All relative paths inside the config file are being interpreted relativ to `baseDir` except of `$schema` which is relative to the config file.

## Configure vuepress

glossarify-md and vuepress need to be aligned in terms of how they create section anchors. More on the *why* see [Appendix](#appendix).

<em>./docs/.vuepress/config.js</em>
~~~js
const glossarify = require("glossarify-md");
const slugify = {
  slugify: glossarify.getSlugger()
};
module.exports = {
    markdown: { ...slugify }     // vuepress v1.x
    // markdown: {               // vuepress v2.x
    //   toc: { ...slugify },
    //   anchor: { ...slugify },
    //   extractHeaders: { ...slugify }
    // }
};
~~~

> ⚠ **Important:** Vuepress maps headings onto section anchors which become part of a URL fragment like `http://.../#foo-anchor`. By default vuepress creates anchors with lowercase ASCII characters, only. In contrast github-slugger will map unicode characters onto their lowercase unicode equivalent, which then affects you our your readers in the following way:
>
> 1. Readers who bookmarked a section URL with an ASCII-only `#`-URL fragment will still be able to open the web page they've bookmarked. But as a minor inconvenience their browser may no longer scroll to the bookmarked page section.
>
> 2. Writers who linked to a heading with unicode characters (e.g. `# Äquator`) using a markdown link `[Foo](#aquator)` may need to change the link target to `[Foo](#äquator)`, so need to replace `#a...` with `#ä...`.

## Configure Build Scripts

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

More information see [README.md](../README.md).

## Markdown Extensions

Vuepress supports some [Markdown Syntax](https://vuepress.vuejs.org/guide/markdown.html) not covered by CommonMark. While most of it will work out of the box, *Frontmatter Syntax* requires a plug-in to work with glossarify-md (see [Markdown Syntax Extensions][doc-syntax-extensions]).

|      Vuepress Markdown Extension      |                   remark plug-in required with glossarify-md                   |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| [Frontmatter][vp-frontmatter]         | [remark-frontmatter](http://unifiedjs.com/explore/package/remark-frontmatter/) |
| [Custom Containers][vp-cc]            | None                                                                           |
| [GitHub Style Tables][vp-gh-tables]   | None                                                                           |
| [Table of Contents][vp-toc] `[[toc]]` | None                                                                           |
| [Emoji][vp-emoji]                     | None                                                                           |
| [Line Highlighting Codeblocks][vp-lh] | None                                                                           |
| [Import Code Snippets][vp-code]       | None                                                                           |

[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter
[vp-gh-tables]: https://vuepress.vuejs.org/guide/markdown.html#github-style-tables
[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers
[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji
[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents
[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks
[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets

## Appendix

glossarify-md and vuepress both employ a slug algorithm to create friendly URL fragments (`#...`) for section links. When vuepress is fed with *glossarified markdown* sources it will attempt to slug URLs again. If both tools use different slug algorithms then there's a risk of both generating different URL fragments which can break links in a book (see [#27](https://github.com/about-code/glossarify-md/issues/27)). To avoid this vuepress needs to be configured to use the same slugger as glossarify-md.


glossarify-md uses [github-slugger] internally. In case you want to get rid of glossarify-md you likely not want to have slugs change again. Then you can use [github-slugger] standalone with vuepress, like so:

*Using github-slugger without glossarify-md*
```js
const GitHubSlugger = require("github-slugger");
const slugify = {
  slugify: (value) => {
      const slugifier = new GitHubSlugger();
      return slugifier.slug(value);
  }
};

module.exports = {
  /* see section "Configure vuepress"... */
};
```
