# Using glossarify-md with vuepress
<!-- aliases: Use with VuePress -->

[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter
[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers
[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji
[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents
[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks
[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets

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

## Configure glossarify-md

*glossarify-md.conf.json*
```json
{
    "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
    "baseDir": "./docs",
    "outDir": "../docs-glossarified",
    "glossaries": [
        { "file": "./glossary.md", "termHint": "★"},
    ]
}
```

> **ⓘ Note:** All relative paths inside the config file are being interpreted relativ to `baseDir` except of `$schema` which is relative to the config file.

## Configure vuepress

glossarify-md and vuepress need to be aligned in terms of how they create URL-friendly IDs for section anchors also called "slugs" (see [*why?*][Appendix])(#appendix).

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

> ⚠ **Non-English Languages:** vuepress's own slugger creates anchors with lowercase *ASCII characters*, only, e.g. German *Äquator* (engl. *equator*) becomes `#aquator`. Now with github-slugger it will map unicode characters onto their lowercase *unicode* equivalent, e.g. `#äquator` (compare the first character). Consequences:
>
> 1. Bookmarks of your readers keep addressing the same page. However, as a minor inconvenience a browser may no longer find content sections outside the visible viewport it would otherwise have scrolled to.
>
> 2. Writers whose input documents contain links with an ASCII fragment will need to change link targets to the unicode variant. In the example they had to change `[Foo](#aquator)` to `[Foo](#äquator)`.

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

## Install and Configure Syntax Extension Plug-Ins

vuepress supports some [Markdown syntax](https://vuepress.vuejs.org/guide/markdown.html) not covered by CommonMark or GFM. See the table below which syntax extension on the left requires installing and configuring a plug-in on the right. See the respective plug-in for its individual default values and config options.


|      Markdown Syntax Extension        |                   remark plug-in required with glossarify-md                   |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| [Frontmatter][vp-frontmatter]         | [remark-frontmatter](http://unifiedjs.com/explore/package/remark-frontmatter/) |
| [Custom Containers][vp-cc]            | -                                                                               |
| [Table of Contents][vp-toc] `[[toc]]` | -                                                                               |
| [Emoji][vp-emoji]                     | -                                                                               |
| [Line Highlighting Codeblocks][vp-lh] | -                                                                               |
| [Import Code Snippets][vp-code]       | -                                                                               |

## Appendix

*Slugs* are "*URL-friendly IDs*" used to identify a content section *within* a hypermedia document. They are not required to locate the document but needed to make a browser navigate to a particular content section *within* a document, for example `https://foo.com/#my-slug` identifies a content section using the Slug or *URL fragment* `#my-slug`.

"*URL-friendly*" means *only certain characters, allowed*. In particular, *whitespaces* need to be encoded. During *linkification* vuepress and glossarify derive slugs from section headings but use different algorithms. They may differ in how they replace whitespaces in the IDs derived from a heading text. As a consequence there's a risk of ending up with broken book-internal links (see [#27](https://github.com/about-code/glossarify-md/issues/27)). To avoid this vuepress needs to be configured to use the same slugger as glossarify-md. In case you want to get rid of glossarify-md you most likely do *not* want to have slugs change, again. You can use [github-slugger] standalone without glossarify-md, like so:

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
