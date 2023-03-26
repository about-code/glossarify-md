# [Using glossarify-md with Hugo](#using-glossarify-md-with-hugo)

<!-- aliases: Use with Hugo, use with Hugo -->

[hugo-page-bundles]: https://gohugo.io/content-management/page-bundles/

[hugo-frontmatter]: https://gohugo.io/content-management/front-matter/

[hugo-shortcodes]: https://gohugo.io/content-management/shortcodes/

[hugo-cm-compliance]: https://github.com/about-code/glossarify-md/issues/165#issuecomment-1086874898

Below we provide a few *examples* on how you *might* be able to facilitate [glossarify-md][1] in a [Hugo 🌎][2] project. But note that existence of this page is not a statement about *Hugo compatibility*.

## [Setup Hugo with glossarify-md](#setup-hugo-with-glossarify-md)

1.  [Install][3] [NodeJS 🌎][4] and [npm 🌎][5]
2.  In your [Hugo 🌎][2] project folder [install][3] [glossarify-md][1]
        npm install glossarify-md
        npx glossarify-md --init --local > glossarify-md.conf.json
        echo node_modules >> .gitignore
3.  In your [Hugo 🌎][2] project folder rename `content` to `content_`.

## [Install Plug-Ins](#install-plug-ins)

[Hugo 🌎][2] supports some [Markdown syntax extensions][6] not supported out-of-the-box by [glossarify-md][1]. See the table below which kind of syntax (left column) requires [installing and configuring a plug-in][7] (right column). See the plug-in's docs for available [config options][8] and default values.

    npm install remark-frontmatter remark-shortcodes

| Markdown Syntax Extension       | plug-in required with [glossarify-md][1] |
| ------------------------------- | ---------------------------------------- |
| [Frontmatter][hugo-frontmatter] | [remark-frontmatter 🌎][9]               |
| [Shortcodes][hugo-shortcodes]   | [remark-shortcodes 🌎][10]               |
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

In a [Hugo 🌎][2] [Leaf Bundle Structure][hugo-page-bundles]

*   each directory represents a page
*   the main content is in an `index.md` Markdown file
*   only the directory name will be part of the page's [URL][11] path segments.

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

In a [Hugo 🌎][2] [Branch Bundle Structure][hugo-page-bundles]

*   Markdown files in the directory represent individual pages
*   each directory has an `_index.md` Markdown file
*   directory *and* file names (without file extension) become [URL][11] path segments.

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

## [Run glossarify-md](#run-glossarify-md)

    npx glossarify-md --config ./glossarify-md.conf.json

You should now see the files in `content_` copied to `content` where they will be picked up by [Hugo 🌎][2]. Should you have any troubles with paths, see also `linking` [config option][8].

## [Known Issues](#known-issues)

### [Different Flavours of "Markdown"](#different-flavours-of-markdown)

[https://github.com/about-code/glossarify-md/issues/246][12]

[Hugo 🌎][2] and [glossarify-md][1] support an overlapping, yet not identical set of Markdown syntax constructs. They share the common set of [CommonMark 🌎][13] and [GFM 🌎][14] constructs. But there is a chance Hugo supports additional features neither in Commonmark nor GFM. As a glossarify-md-with-Hugo user you may

*   need to restrict yourself to using the common set of syntax, only
*   or need to [install][3] a syntax plug-in, when there's one available
*   or need to step back from [glossarify-md][1] given you can't sacrifice certain [Hugo 🌎][2] features.

### [Shortcodes in Markdown Links](#shortcodes-in-markdown-links)

[https://github.com/about-code/glossarify-md/issues/165#issuecomment-1086874898][hugo-cm-compliance]

[glossarify-md][1] can be enhanced with [syntax plug-ins][15] to accept shortcode syntax. But it won't be able to support certain combinations of [CommonMark 🌎][13] syntax *and* shortcode syntax, e.g. CommonMark link syntax `[]()` combined with shortcode syntax `{{< relref >}}` to something like `[Foo]({{< relref bar >}})`. glossarify-md requires valid CommonMark input but the combined syntax [is not valid CommonMark][hugo-cm-compliance] (as of CommonMark v0.30).

### [Things get escaped with `\`](#things-get-escaped-with-)

There may be two reasons:

1.  input files use custom syntax not understood by [glossarify-md][1]. See known issue *Different flavors of Markdown*, above.
2.  there is an improper combination of [CommonMark 🌎][13] syntax elements and non-standard syntax which violates the CommonMark spec. For an example, see known issue *[Shortcodes in Markdown Links][16]*, above.

### [Link paths](#link-paths)

[Hugo 🌎][2] has its own means of producing website URLs from a project's filesystem. We have shown [glossarify-md][1] configurations that fit a particular project structure but they have not been tested beyond a few simple Hugo demo pages. Feel free to experiment with glossarify-md options and \[`linking` options]\[doc-linking] in particular if the config doesn't work for you.

[1]: https://github.com/about-code/glossarify-md

[2]: https://gohugo.io "A static website renderer compiling an HTML website from Markdown files."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/install.md#install

[4]: https://nodejs.org

[5]: https://npmjs.com "Node Package Manager."

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/markdown-syntax-extensions.md#markdown-syntax-extensions "glossarify-md supports CommonMark and GitHub Flavoured Markdown (GFM)."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins.md#installing-and-configuring-plug-ins "The following example demonstrates how to install remark-frontmatter, a syntax plug-in from the remark plug-in ecosystem which makes glossarify-md (resp."

[8]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[9]: https://npmjs.com/package/remark-frontmatter "A remark syntax plug-in supporting pseudo-standard front-matter syntax."

[10]: https://www.npmjs.com/package/remark-shortcodes "A remark syntax plug-in supporting non-standard Hugo shortcodes syntax."

[11]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[12]: https://github.com/about-code/glossarify-md/issues/246

[13]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[14]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"

[15]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins-dev.md#syntax-plug-ins "Syntax Plug-ins extend Markdown syntax itself, like remark-frontmatter, for example."

[16]: https://github.com/about-code/glossarify-md/blob/master/doc/use-with-hugo.md#shortcodes-in-markdown-links "https://github.com/about-code/glossarify-md/issues/165#issuecomment-1086874898 glossarify-md can be enhanced with syntax plug-ins to accept shortcode syntax."
