# Using glossarify-md with Hugo

[doc-readme]: https://github.com/about-code/glossarify-md/blob/master/doc/README.md#linking
[doc-plugins]: ./plugins.md
[doc-mdext-syntax]: ./markdown-syntax-extensions.md
[hugo-page-bundles]: https://gohugo.io/content-management/page-bundles/
[hugo-frontmatter]: https://gohugo.io/content-management/front-matter/
[hugo-shortcodes]: https://gohugo.io/content-management/shortcodes/
[hugo-cm-compliance]: https://github.com/about-code/glossarify-md/issues/165#issuecomment-1086874898
[known issues]: #known-issues

Below we provide a few *examples* on how you *might* be able to facilitate glossarify-md in a Hugo project. But note that existence of this page is not a statement about *Hugo compatibility*.

## Setup

> ⚠ If your project is not under version control make a copy of your Hugo project.

1. Install NodeJS and npm
1. Install glossarify-md
   ~~~
   npm install -g glossarify-md
   ~~~
1. In your hugo project rename `content` to `content_`.


## Install Plug-Ins

Hugo supports some [Markdown syntax](https://vuepress.vuejs.org/guide/markdown.html) not [supported by glossarify-md][doc-mdext-syntax]. See the table below which syntax extensions on the left require [installing and configuring a plug-in][doc-plugins] on the right. See plug-in docs for its individual default values and config options.

|    Markdown Syntax Extension    | plug-in required with glossarify-md |
| ------------------------------- | ----------------------------------- |
| [Frontmatter][hugo-frontmatter] | remark-frontmatter                  |
| [Shortcodes][hugo-shortcodes]   | remark-shortcodes                   |
| ...and maybe others             |                                     |

## Base Configuration

*glossarify-md.conf.json*
~~~json
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v5.1.0/conf/v5/schema.json",
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
~~~

## Configure for a Hugo "Leaf Bundle Structure"

In a Hugo [Leaf Bundle Structure][hugo-page-bundles]

- each directory represents a page
- the main content is in an `index.md` Markdown file
- only the directory name will be part of the page's URL path segments.

Its easier to configure glossarify-md for a Leaf Bundle Structure:

~~~
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
   +- content/
   +- data/
   +- layouts/
   +- ...
   |- config.toml
   '- glossarify-md.conf.json
~~~

*Add to glossarify-md.conf.json*

~~~json
{
  "linking": {
    "pathComponents": ["path"],
    "headingAsLink": false
  },
  "glossaries": [{
    "file": "./glossary/index.md"
  }],
}
~~~

Then run

~~~
glossarify-md --config ./glossarify-md.conf.json
~~~

You should now see the files in `content_` copied to `content` where they will be picked up by Hugo. Should you have any troubles with paths, see also [`linking` options][doc-readme].

# Hugo "Branch Bundle Structure"

In a Hugo [Branch Bundle Structure][hugo-page-bundles]

- Markdown files in the directory represent individual pages
- each directory has an `_index.md` Markdown file
- directory *and* file names (without file extension) become URL path segments.

~~~
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
   +- content/
   +- data/
   +- layouts/
   +- ...
   |- config.toml
   '- glossarify-md.conf.json
~~~

*Add to glossarify-md.conf.json*:

~~~json
{
  "linking": {
    "pathComponents": ["path", "file"],
    "headingAsLink": false
  },
  "glossaries": [{
    "file": "./glossary/glossary.md"
  }],
}
~~~


## Known Issues

### Shortcodes in Markdown Links

glossarify-md can be enhanced with syntax plug-ins to accept shortcode syntax in general. But it won't be able to support certain combinations of CommonMark syntax *and* shortcode syntax, such as when combining CommonMark link syntax `[]()` and shortcode `{{< relref >}}` to something like `[Foo]({{< relref bar >}})`. This is because the result is [not valid CommonMark][hugo-cm-compliance] (as of CommonMark v0.30).

### Escaping with `\`

There may be two reasons:

1. input files use custom syntax not understood by glossarify-md. Try [installing an appropirate syntax plug-in][doc-plugins]
1. There is an improper combination of CommonMark syntax elements and non-standard syntax elements which is not permitted by CommonMark (see known issue with shortcodes in Markdown links). If this is the problem, then there's only a choice between glossarify-md *or* the problematic syntax, but no way to have both.

### Link paths

Hugo has its own means of producing website URLs from a project's filesystem. We have shown glossarify-md configurations that fit a particular project structure but have not been tested beyond a few simple Hugo demo pages. Feel free to experiment with glossarify-md options if the config doesn't work for you.
