# [Using glossarify-md with vuepress](#using-glossarify-md-with-vuepress)

<!-- aliases: Use with VuePress -->

[vp-frontmatter]: https://vuepress.vuejs.org/guide/markdown.html#frontmatter

[vp-cc]: https://vuepress.vuejs.org/guide/markdown.html#custom-containers

[vp-emoji]: https://vuepress.vuejs.org/guide/markdown.html#emoji

[vp-toc]: https://vuepress.vuejs.org/guide/markdown.html#table-of-contents

[vp-lh]: https://vuepress.vuejs.org/guide/markdown.html#line-highlighting-in-code-blocks

[vp-code]: https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets

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

## [Install into your project](#install-into-your-project)

    npm i --save glossarify-md

## [Configure glossarify-md](#configure-glossarify-md)

*[glossarify-md][1].conf.json*

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

## [Configure vuepress](#configure-vuepress)

[glossarify-md][1] and [vuepress 🌎][2] need to be aligned in terms of how they create URL-friendly IDs for section anchors also called "[slugs][3]" (see \[*why?*]\[Appendix])(#[appendix][4]).

<em>./docs/.vuepress/config.js</em>

```js
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
```

> ⚠ **Non-English Languages:** vuepress's own slugger creates anchors with lowercase *ASCII characters*, only, e.g. German *Äquator* (engl. *equator*) becomes `#aquator`. Now with github-slugger it will map unicode characters onto their lowercase *unicode* equivalent, e.g. `#äquator` (compare the first character). Consequences:
>
> 1.  Bookmarks of your readers keep addressing the same page. However, as a minor inconvenience a browser may no longer find content sections outside the visible viewport it would otherwise have scrolled to.
>
> 2.  Writers whose input documents contain links with an ASCII fragment will need to change link targets to the unicode variant. In the example they had to change `[Foo](#aquator)` to `[Foo](#äquator)`.

## [Configure Build Scripts](#configure-build-scripts)

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
*   `npm run build` just builds the glossarified [vuepress 🌎][2] site without running a server.

More information see [README.md][5].

## [Install and Configure Syntax Extension Plug-Ins](#install-and-configure-syntax-extension-plug-ins)

[vuepress 🌎][2] supports some [Markdown syntax][6] not covered by [CommonMark 🌎][7] or [GFM 🌎][8]. See the table below which syntax extension on the left requires [installing and configuring a plug-in][9] on the right. See the respective plug-in for its individual default values and [config options][10].

| Markdown Syntax Extension             | [remark 🌎][11] plug-in required with [glossarify-md][1] |
| ------------------------------------- | -------------------------------------------------------- |
| [Frontmatter][vp-frontmatter]         | [remark-frontmatter][12]                                 |
| [Custom Containers][vp-cc]            | -                                                        |
| [Table of Contents][vp-toc] `[[toc]]` | -                                                        |
| [Emoji][vp-emoji]                     | -                                                        |
| [Line Highlighting Codeblocks][vp-lh] | -                                                        |
| [Import Code Snippets][vp-code]       | -                                                        |

## [Appendix](#appendix)

*[Slugs][3]* are "*URL-friendly IDs*" used to identify a content section *within* a hypermedia document. They are not required to locate the document but needed to make a browser navigate to a particular content section *within* a document, for example `https://foo.com/#my-slug` identifies a content section using the Slug or *[URL fragment][13]* `#my-slug`.

"*URL-friendly*" means *only certain characters, allowed*. In particular, *whitespaces* need to be encoded. During *[linkification][14]* [vuepress 🌎][2] and glossarify derive [slugs][3] from section headings but use different algorithms. They may differ in how they replace whitespaces in the IDs derived from a heading text. As a consequence there's a risk of ending up with broken book-internal links (see [#27][15]). To avoid this vuepress needs to be configured to use the same slugger as [glossarify-md][1]. In case you want to get rid of glossarify-md you most likely do *not* want to have slugs change, again. You can use \[github-slugger] standalone without glossarify-md, like so:

*Using [github-slugger 🌎][16] without [glossarify-md][1]*

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

[1]: https://github.com/about-code/glossarify-md

[2]: https://vuepress.vuejs.org "A static website generator translating markdown files into a website powered by [vuejs]."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#slug "A slug is a URL-friendly identifier that can be used within URL fragments to address headings / sections on a page."

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/use-with-vuepress.md#appendix "Slugs are \"URL-friendly IDs\" used to identify a content section within a hypermedia document."

[5]: ../README.md

[6]: https://vuepress.vuejs.org/guide/markdown.html

[7]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[8]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins.md#installing-and-configuring-plug-ins "The following example demonstrates how to install remark-frontmatter, a syntax plug-in from the remark plug-in ecosystem which makes glossarify-md (resp."

[10]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[11]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[12]: http://unifiedjs.com/explore/package/remark-frontmatter/

[13]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#url-fragment "The fragment is the part follwing the # in a URL."

[14]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#linkification "Process of searching for a term in document A matching a heading phrase in
document B and replacing the term in document A with a Markdown link pointing
onto the term definition in document B."

[15]: https://github.com/about-code/glossarify-md/issues/27

[16]: https://npmjs.com/package/github-slugger "A library providing support for slugs."
