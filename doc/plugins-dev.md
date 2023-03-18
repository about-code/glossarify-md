# [Writing a Plug-In](#writing-a-plug-in)

[remark-discussion]: https://github.com/remarkjs/remark/discussions/869#discussioncomment-1602674

## [Syntax Plug-Ins](#syntax-plug-ins)

Syntax [Plug-ins][1] extend Markdown syntax itself, like [remark-frontmatter🌎][2], for example. They contribute new *node types* to an internal Abstract Syntax Tree (AST). Further they provide a tokenizer to parse and a serializer to write markdown files. Writing syntax plug-ins is a bit more elaborate. At this point we like to refer you to the documentation of [micromark🌎][3] and [mdAst🌎][4]. When exploring these projects you might find this [description of the overall process][remark-discussion] helpful.

## [Tree-Plug-Ins](#tree-plug-ins)

*Tree [plug-ins][1]* operate on a markdown syntax tree ([mdAST🌎][4]). They are much easier to write and use [CommonMark🌎][5] and [GFM🌎][6] syntax and respective AST node types to do their job. Basically they inspect, add, remove or resort AST nodes. [glossarify-md🌎][7] operates on tree plug-ins, almost only (see page [Conceptual Layers][8]).

A tree plug-in is a function which returns a callback that when called get's passed an [mdAst🌎][4] root node (`tree`):

*remark-my-plug-in.js*

```js
import { visit } from "unist-util-visit";

/**
 * Plugin to add an additional query parameter to each URL
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function myPlugin(options = {}) {
  return (tree) => {
    return visit(tree, "link", (node, parent, index) => {
      node.url += "&visited=true";
      return node;
    });
  };
}
```

The example simply adds a `&visited=true` [URL][9] query parameter to each Markdown link in a document.

It uses a *visit* utility function (see [mdast-util-visit🌎][10]) with a filter argument (2) and visitor callback argument (3). The filter argument can be the name of a node type or a filter function which gets passed a node and is expected to return a boolean.  For a list of [CommonMark🌎][5] node types see [mdAst🌎][4]. Eventually, the plug-in function returns the tree's root node again.
Note the `options` argument: this is how your plug-in would get passed its [config options][11] (see [Installing Plug-Ins][12]).

Let's save the plug-in to *plugins/remark-my-plug-in.js* next to `outDir`:

    ${root}
       +- docs/                        (baseDir)
       +- docs-glossarified/           (outDir)
       +- node_modules/
       +- plugins
       |     '- remark-my-plug-in.js   <=== your plug-in
       |- glossarify-md.conf.json
       |- remark.conf.json
       |- package.json
       '- .gitignore

In your `glossarify-md.conf.json` add:

```json
{
  "unified": {
    "plugins": {
      "../plugins/remark-my-plug-in.js": { "your": "options" }
    }
  }
}
```

The plug-in path is rooted in `outDir` so you need to step out.
That's it. Run [glossarify-md🌎][7] again and check the links in Markdown files in your output directory.

## [Creating a Plug-in Package (optional)](#creating-a-plug-in-package-optional)

If you aim for publishing a plug-in, here's how you could set up a plug-in package project next to a [glossarify-md🌎][7] project:

1.  Make a new directory *remark-my-plug-in* next to `${root}` and initialize it as an [npm🌎][13] package.

        mkdir ./remark-my-plug-in
        cd ./remark-my-plug-in
        npm init

2.  Open your `package.json` and add

        "type": "module",
        "exports": "./index.js",

3.  Copy the JavaScript code sample or `remark-my-plug-in.js` (see prev. section) to a file `index.js`

4.  Install the [npm🌎][13] dependency required by the code sample

        npm install unist-util-visit

5.  You're now set with your plug-in. This step will make your package usuable, *locally*, with symlinking (since it's not yet published to [npm🌎][13]).

    `cd` into your [glossarify-md🌎][7] project and create another symlink onto the global symlink:

        npm link ../remark-my-plug-in

    > **Important:** Ths step needs to be repeated whenever you ran `npm install` in your glossarify-md project.

    You now virtually "installed" your plug-in to your [glossarify-md🌎][7] project similar as if you had run `npm install remark-my-plug-in` to fetch it from the [npm🌎][13] registry. What's left is configuring glossarify-md to use it (see also previous section):

6.  Add to your *[glossarify-md🌎][7].conf.json*

        unified: {
           "plugins": {
             "remark-my-plug-in": { "your": "options" }
           }
        }

7.  Delete your `outDir`, run [glossarify-md🌎][7] again and see whether link output changed.

### [Publishing a Plug-in Package](#publishing-a-plug-in-package)

Prior to publishing check what would get published:

    npm pack

The command creates a `tar.gz` file. Inspect its contents. Optionally, use a `files` whitelist in `package.json` to select which files should go into a package.

> Prior to publishing to the official npm registry, you may also find setting up a test registry on `localhost` useful. See verdaccio, for an example.

More see official [NPM🌎][13] docs on [publishing your node package][14].

[1]: https://github.com/about-code/glossarify-md/tree/master/doc/plugins.md

[2]: https://npmjs.com/package/remark-frontmatter "A remark syntax plug-in supporting pseudo-standard front-matter syntax."

[3]: https://github.com/micromark/ "A low-level extensible implementation of the CommonMark syntax specification (parsing and tokenizing)."

[4]: https://github.com/syntax-tree/mdast "Specification and Implementation of a Markdown Abstract Syntax Tree."

[5]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[6]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"

[7]: https://github.com/about-code/glossarify-md "This project."

[8]: https://github.com/about-code/glossarify-md/tree/master/docconceptual-layers.md

[9]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[10]: https://npmjs.com/package/mdast-util-visit

[11]: https://github.com/about-code/glossarify-md/tree/master/conf/README.md

[12]: #installing-plug-ins

[13]: https://npmjs.com "Node Package Manager."

[14]: https://docs.npmjs.com/packages-and-modules
