# Using glossarify-md with vuepress

Below we assume a *sample* project structure like this:

[CommonMark]: https://www.commonmark.org

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
> relativ to `baseDir` except for `$schema` which is relative to the config file.

## Configure vuepress

```js
// .vuepress/config.js
const glossarify = require("glossarify-md");
module.exports = {
    /* ... */
    markdown: {
      slugify: glossarify.getSlugger()
    }
};
```

Details on why we have to use a modified slug algorithm with vuepress and can be found in [Appendix](#appendix).


> **Warnings**
>
> ⚠ Changing the slug algorithm might be a breaking change in *published* docs. URLs, especially URL fragments may change. Bookmarks of your readers may become outdated.
>
> ⚠ For headings with unicode characters, e.g. `# Äquator` vuepress generates lowercase slugs with ASCII characters, only, which you might referred to by links `[Äquator](#aquator)`. [glossarify-md]'s slugger keeps non-ASCII characters and requires you to refer to the same heading by `[Äquator](#äquator)`, so by a lowercase slug with **ä**.

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
- `npm start` builds and serves files quickly from `baseDir` with *live-reload*. This is what you probably want while writing even though it doesn't produce glossarified output.
- `npm run glossarified` builds and serves the glossarified version from `outDir`.
- `npm run build` just builds the glossarified version without running a server.

More information see [README.md](../README.md).

## Markdown Extensions

Vuepress lists a few [Markdown Extensions](https://vuepress.vuejs.org/guide/markdown.html) like *Frontmatter*, *Emojis* etc.
Make sure to read [Markdown Syntax Extensions](../README.md#markdown-syntax-extensions), if your input files contain syntax sugar not covered by the [CommonMark] spec.
Below is a list of remark plug-ins you may consider:

|      Vuepress Markdown Extension      |                   remark plug-in required with glossarify-md                    |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| [Frontmatter][vp-frontmatter]         | [remark-frontmatter](http://unifiedjs.com/explore/package/remark-frontmatter/)  |
| [Custom Containers][vp-cc]            | [remark-directive](https://github.com/remarkjs/remark-directive)                |
| [GitHub Style Tables][vp-gh-tables]   | None (glossarify-md loads [remark-gfm](https://github.com/remarkjs/remark-gfm)) |
| [Table of Contents][vp-toc] `[[toc]]` | None                                                                            |
| [Emoji][vp-emoji]                     | None                                                                            |
| [Line Highlighting Codeblocks][vp-lh] | None                                                                            |
| [Import Code Snippets][vp-code]       | None                                                                            |

[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter
[vp-gh-tables]: https://vuepress.vuejs.org/guide/markdown.html#github-style-tables
[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers
[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji
[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents
[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks
[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets

## Appendix

[glossarify-md] requires a slug algorithm to create friendly URL fragments (#...) for section links. When vuepress translates *glossarified markdown* to HTML it does the same once again for the same purpose. If both tools use different slug algorithms then there's the risk of both generating different fragments which can break links in some situations ([#27](https://github.com/about-code/glossarify-md/issues/27)). So it's best to configure vuepress to use the same slugger as [glossarify-md].


[glossarify-md] uses [github-slugger](https://npmjs.com/package/github-slugger) internally. In case you no longer want to use [glossarify-md] you might not want to have slugs change again. Then you can use the slugger directly with vuepress, too:

```js
//.vuepress/config.js
const GitHubSlugger = require("github-slugger");
module.exports = {
  /* ... */
  markdown: {
    slugify: (value) => {
      const slugifier = new GitHubSlugger();
      return slugifier.slug(value);
    }
  }
};
```

[vuepress]: https://vuepress.vuejs.org
[glossarify-md]: https://github.com/about-code/glossarify-md
