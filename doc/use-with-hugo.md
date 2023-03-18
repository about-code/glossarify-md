# [Using glossarify-md with Hugo](#using-glossarify-md-with-hugo)

[hugo-page-bundles]: https://gohugo.io/content-management/page-bundles/

[hugo-frontmatter]: https://gohugo.io/content-management/front-matter/

[hugo-shortcodes]: https://gohugo.io/content-management/shortcodes/

[hugo-cm-compliance]: https://github.com/about-code/glossarify-md/issues/165#issuecomment-1086874898

Below we provide a few *examples* on how you *might* be able to facilitate [glossarify-md][1] in a [Hugo][2] project. But note that existence of this page is not a statement about *Hugo compatibility*.

## [Setup](#setup)

1.  Install [NodeJS][3] and [npm][4]
2.  In your [Hugo][2] project folder install [glossarify-md][1]
        npm install glossarify-md
        npx glossarify-md --init --local > glossarify-md.conf.json
        echo node_modules >> .gitignore
3.  In your [Hugo][2] project folder rename `content` to `content_`.

## [Install Plug-Ins](#install-plug-ins)

[Hugo][2] supports some [Markdown syntax extensions][5] not supported out-of-the-box by [glossarify-md][1]. See the table below which kind of syntax (left column) requires [installing and configuring a plug-in][6] (right column). See the plug-in's docs for available [config options][7] and default values.

    npm install remark-frontmatter remark-shortcodes

| Markdown Syntax Extension       | plug-in required with [glossarify-md][1] |
| ------------------------------- | ---------------------------------------- |
| [Frontmatter][hugo-frontmatter] | [remark-frontmatter][8]                  |
| [Shortcodes][hugo-shortcodes]   | [remark-shortcodes][9]                   |
| ...and maybe others             |                                          |

## [Configure glossarify-md](#configure-glossarify-md)

*[glossarify-md][1].conf.json*

```json
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
  "baseDir": "./content_",
  "outDir": "../content",
  "unified": {
    "plugins": {
      "remark-frontmatter": {},
      "remark-shortcodes": {
        "startBlock": "{{<",
        "endBlock": ">}}"
      }
    }
  }
}
```

### [Option 1: Configure for a Hugo "Leaf Bundle Structure"](#option-1-configure-for-a-hugo-leaf-bundle-structure)

In a [Hugo][2] [Leaf Bundle Structure][hugo-page-bundles]

*   each directory represents a page
*   the main content is in an `index.md` Markdown file
*   only the directory name will be part of the page's [URL★][10] path segments.

Its easier to configure [glossarify-md][1] for a Leaf Bundle Structure:

```
${root}
   +- content_/
   |   +- home/
   |   |   '- index.md
   |   |          .-----------------
   |   |         | # Home
   |   |         |
   |   |         | What is Hugo?
   |   |         ~
   |   +- company/
   |   +- products/
   |   +- glossary/
   |       '- index.md
   |             .--------------------------------
   |             | # Glossary
   |             |
   |             | ## Hugo
   |             | Hugo is a static site renderer.
   |             ~
   +- data/
   +- layouts/
   +- node_modules
   +- ...
   |- config.toml
   |- glossarify-md.conf.json
   |- package-lock.json
   '- package.json

```

*Add to [glossarify-md][1].conf.json*

```json
{
  "linking": {
    "pathComponents": ["path"],
    "headingAsLink": false
  },
  "glossaries": [{
    "file": "./glossary/index.md"
  }],
}
```

### [Option 2: Configure for a Hugo "Branch Bundle Structure"](#option-2-configure-for-a-hugo-branch-bundle-structure)

In a [Hugo][2] [Branch Bundle Structure][hugo-page-bundles]

*   Markdown files in the directory represent individual pages
*   each directory has an `_index.md` Markdown file
*   directory *and* file names (without file extension) become [URL★][10] path segments.

<!---->

    ${root}
       +- content_/
       |   +- home/
       |   |   |- _index.md
       |   |   '- home.md
       |   |         .-----------------
       |   |         | # Home
       |   |         |
       |   |         | What is Hugo?
       |   |         ~
       |   +- company/
       |   +- products/
       |   +- glossary/
       |       |- _index.md
       |       '- glossary.md
       |             .--------------------------------
       |             | # Glossary
       |             |
       |             | ## Hugo
       |             | Hugo is a static site renderer.
       |             ~
       +- data/
       +- layouts/
       +- node_modules
       +- ...
       |- config.toml
       |- glossarify-md.conf.json
       |- package-lock.json
       '- package.json

*Add to [glossarify-md][1].conf.json*:

```json
{
  "linking": {
    "pathComponents": ["path", "file"],
    "headingAsLink": false
  },
  "glossaries": [{
    "file": "./glossary/glossary.md"
  }],
}
```

## [Run](#run)

    npx glossarify-md --config ./glossarify-md.conf.json

You should now see the files in `content_` copied to `content` where they will be picked up by [Hugo][2]. Should you have any troubles with paths, see also `linking` [config option][7].

## [Known Issues](#known-issues)

### [Different Flavours of "Markdown"](#different-flavours-of-markdown)

[https://github.com/about-code/glossarify-md/issues/246][11]

[Hugo][2] and [glossarify-md][1] support an overlapping, yet not identical set of Markdown syntax constructs. They share the common set of [CommonMark][12] and [GFM][13] constructs. But there is a chance Hugo supports additional features neither in Commonmark nor GFM. As a glossarify-md-with-Hugo user you may

*   need to restrict yourself to using the common set of syntax, only
*   or need to [install a syntax plug-in][6], when there's one available
*   or need to step back from [glossarify-md][1] given you can't sacrifice certain [Hugo][2] features.

### [Shortcodes in Markdown Links](#shortcodes-in-markdown-links)

[https://github.com/about-code/glossarify-md/issues/165#issuecomment-1086874898][hugo-cm-compliance]

[glossarify-md][1] can be enhanced with syntax [plug-ins][6] to accept shortcode syntax. But it won't be able to support certain combinations of [CommonMark][12] syntax *and* shortcode syntax, e.g. CommonMark link syntax `[]()` combined with shortcode syntax `{{< relref >}}` to something like `[Foo]({{< relref bar >}})`. glossarify-md requires valid CommonMark input but the combined syntax [is not valid CommonMark][hugo-cm-compliance] (as of CommonMark v0.30).

### [Things get escaped with `\`](#things-get-escaped-with-)

There may be two reasons:

1.  input files use custom syntax not understood by [glossarify-md][1]. See known issue *Different flavors of Markdown*, above.
2.  there is an improper combination of [CommonMark][12] syntax elements and non-standard syntax which violates the CommonMark spec. For an example, see known issue *Shortcodes in Markdown Links*, above.

### [Link paths](#link-paths)

[Hugo][2] has its own means of producing website URLs from a project's filesystem. We have shown [glossarify-md][1] configurations that fit a particular project structure but they have not been tested beyond a few simple Hugo demo pages. Feel free to experiment with glossarify-md options and \[`linking` options]\[doc-linking] in particular if the config doesn't work for you.

[1]: https://github.com/about-code/glossarify-md "This project."

[2]: https://gohugo.io "A static website renderer compiling an HTML website from Markdown files."

[3]: https://nodejs.org

[4]: https://npmjs.com "Node Package Manager."

[5]: https://github.com/about-code/glossarify-md/tree/master/doc/markdown-syntax-extensions.md

[6]: https://github.com/about-code/glossarify-md/tree/master/doc/plugins.md

[7]: https://github.com/about-code/glossarify-md/tree/master/conf/README.md

[8]: https://npmjs.com/package/remark-frontmatter "A remark syntax plug-in supporting pseudo-standard front-matter syntax."

[9]: https://www.npmjs.com/package/remark-shortcodes "A remark syntax plug-in supporting non-standard Hugo shortcodes syntax."

[10]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[11]: https://github.com/about-code/glossarify-md/issues/246

[12]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[13]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"
