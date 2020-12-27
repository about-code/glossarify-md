# [Using glossarify-md with vuepress](#using-glossarify-md-with-vuepress)

Below we assume a *sample* project structure like this:

[CommonMark]: https://www.commonmark.org

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

## [Install into your project](#install-into-your-project)

    npm i --save glossarify-md

## [Configure glossarify-md](#configure-glossarify-md)

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

## [Configure vuepress](#configure-vuepress)

*.[vuepress↴][1]/config.js*

```js
const glossarify = require("glossarify-md");
module.exports = {
    /* ... */
    markdown: {
      slugify: glossarify.getSlugger()
    }
};
```

Details on why we have to use a modified [slug↴][2] algorithm with [vuepress↴][1] can be found in [Appendix][3].

> **Notes**
>
> ⚠ Changing the slug algorithm could be a **breaking change** for published docs. URLs or URL fragments could change. Bookmarks of your readers may no longer work as expected. If this is important to you or your readers verify the outcome carefully before you publish your changes.
>
> ⚠ For headings with unicode characters, e.g. `# Äquator` vuepress generates HTML anchors with *ASCII* characters which you'd refer to by links `[Äquator](#aquator)`. [glossarify-md] allows unicode characters in fragments and requires you to refer to the same heading by `[Äquator](#äquator)` so by a fragment beginning with #**ä**.

## [Configure Build Scripts](#configure-build-scripts)

*package.json*

```json

"scripts": {
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "start": "vuepress dev docs",
  "glossarified": "npm run glossarify && vuepress dev docs-glossarified",
  "build": "npm run glossarify && vuepress build docs-glossarified",
}
```

*   `npm start` builds and serves files with *live-reload* from `"baseDir": "./docs"`.

This is what you probably want while writing.

*   `npm run glossarified` builds and serves the glossarified version from `"outDir": "../docs-glossarified"`. There's no live-reload.

*   `npm run build` just builds the glossarified version without running a server.

More information see [README.md][4].

## [Markdown Extensions](#markdown-extensions)

[Vuepress↴][1] lists a few [Markdown Extensions][5] like *Frontmatter*, *Emojis* etc.
Make sure to read [Markdown Syntax Extensions][6], if your input files contain syntax sugar not covered by the [CommonMark] spec.
Below is a list of [remark↴][7] plug-ins you may consider:

| [Vuepress↴][1] Markdown Extension     | [remark↴][7] plug-in required with glossarify-md |
| ------------------------------------- | ------------------------------------------------ |
| [Frontmatter][vp-frontmatter]         | [remark-frontmatter][8]                          |
| [Custom Containers][vp-cc]            | [remark-directive][9]                            |
| [GitHub Style Tables][vp-gh-tables]   | None (glossarify-md loads [remark-gfm][10])      |
| [Table of Contents][vp-toc] `[[toc]]` | None                                             |
| [Emoji][vp-emoji]                     | None                                             |
| [Line Highlighting Codeblocks][vp-lh] | None                                             |
| [Import Code Snippets][vp-code]       | None                                             |

[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter

[vp-gh-tables]: https://vuepress.vuejs.org/guide/markdown.html#github-style-tables

[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers

[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji

[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents

[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks

[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets

## [Appendix](#appendix)

### [Why glossarify-md requires changing vuepress's slugify algorithm:](#why-glossarify-md-requires-changing-vuepresss-slugify-algorithm)

[glossarify-md] requires a [slug↴][2] algorithm to create friendly URL fragments (#...) for section links. When [vuepress↴][1] translates *glossarified markdown* to HTML it does the same once again for the same purpose. If both tools use different [slug↴][2] algorithms then there's the risk of both generating different fragments which can break links in some situations ([#27][11]). So it's best to configure [vuepress↴][1] to use the same slugger as [glossarify-md].

> **☛ Note:** If you decide to drop [glossarify-md] later you might not want to have slugs change again. [glossarify-md] uses [github-slugger][12] internally. You can use it directly like so:
>
> *.vuepress/config.js*
>
> ```js
>  const GitHubSlugger = require("github-slugger");
>  module.exports = {
>      /* ... */
>      markdown: {
>        slugify: (value) => {
>          const slugifier = new GitHubSlugger();
>          return slugifier.slug(value);
>        }
>      }
>  };
> ```

[vuepress]: https://vuepress.vuejs.org

[glossarify-md]: https://github.com/about-code/glossarify-md

[1]: ./glossary.md#vuepress "vuepress is a static website generator translating markdown files into a website powered by vuejs."

[2]: ./glossary.md#slug "URLs have a structure scheme://domain.tld/path/#fragment?query&query."

[3]: #appendix

[4]: ../README.md

[5]: https://vuepress.vuejs.org/guide/markdown.html

[6]: ../README.md#markdown-syntax-extensions

[7]: ./glossary.md#remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[8]: http://unifiedjs.com/explore/package/remark-frontmatter/

[9]: https://github.com/remarkjs/remark-directive

[10]: https://github.com/remarkjs/remark-gfm

[11]: https://github.com/about-code/glossarify-md/issues/27

[12]: https://npmjs.com/package/github-slugger
