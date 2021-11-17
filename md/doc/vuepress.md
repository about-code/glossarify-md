# Using glossarify-md with vuepress

Below we assume a *sample* project structure like this:

[CommonMark]: https://www.commonmark.org
[github-slugger]: https://npmjs.com/package/github-slugger
[glossarify-md]: https://github.com/about-code/glossarify-md
[vuepress]: https://vuepress.vuejs.org

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
        { "file": "./glossary.md", "termHint": "↴"},
    ]
}
```

> **Notes**
>
> ☛ All relative paths inside the config file are being interpreted
> relativ to `baseDir` except of `$schema` which is relative to the config file.

## Configure vuepress

*./docs/.vuepress/config.js*
~~~js
const slugify = {
  slugify: require("glossarify-md").getSlugger();
};
module.exports = {
    markdown: { ...slugify }    // vuepress v1.x
    // markdown: {               // vuepress v2.x
    //   toc: { ...slugify },
    //   anchor: { ...slugify },
    //   extractHeaders: { ...slugify }
    // }
};
~~~

> ⚠ Important:
>
> To generate linkable sections vuepress maps headings onto section anchors. They'll make it into a URL fragment after `#`. By default vuepress creates anchors with lowercase ASCII characters, only. In contrast [glossarify-md]'s [github-slugger] will map unicode characters onto their lowercase unicode equivalent, which then affects you our your readers in the following way:
>
> 1. Readers who bookmarked a section URL with an ASCII-only `#`-URL fragment will still be able to open the web page they've bookmarked. But as a minor inconvenience their browser may no longer scroll to the bookmarked page section.
>
> 2. Writers who linke to a heading with unicode characters (e.g. `# Äquator`[^1]) using a markdown link `[Foo](#aquator)` may need to change the link target to `[Foo](#äquator)`, so need to replace `#a...` with **#ä...**.

Details on why we have to use a modified slug algorithm with vuepress can be found in [Appendix](#appendix).

[^1]: German term for *Equator*

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

Vuepress has a few [Markdown Extensions](https://vuepress.vuejs.org/guide/markdown.html). Most of them work out of the box. Though, *Frontmatter* requires a plug-in to work with glossarify-md. Read [Markdown Syntax Extensions](../README.md#markdown-syntax-extensions), for using glossarify-md with Markdown syntax not covered by the [CommonMark] Spec.

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

[glossarify-md] requires a slug algorithm to create friendly URL fragments (#...) for section links. When vuepress translates *glossarified markdown* to HTML it does the same once again for the same purpose. If both tools use different slug algorithms then there's the risk of both generating different fragments which can break links in some situations ([#27](https://github.com/about-code/glossarify-md/issues/27)). So it's best to configure vuepress to use the same slugger as [glossarify-md].


[glossarify-md] uses [github-slugger] internally. In case you want to get rid of [glossarify-md] you likely not want to have slugs change again. Then you can use [github-slugger] standalone with vuepress, like so:

*vuepress (v1.x) config without glossarify-md but github-slugger, only*
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
