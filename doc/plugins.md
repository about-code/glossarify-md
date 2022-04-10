# [Installing Syntax Plug-ins](#installing-syntax-plug-ins)

[doc-conceptual-layers]: ./conceptual-layers.md

[mdast-util-visit]: https://npmjs.com/package/mdast-util-visit

[remark-discussion]: https://github.com/remarkjs/remark/discussions/869#discussioncomment-1602674

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

[remark-plugin]: https://github.com/remarkjs/awesome-remark

[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

The following example demonstrates how to install a [remark plug-in][remark-plugin]. The plug-in will extend [glossarify-md⎆][1]'s markdown parser [remark⎆][2]  with support for *Frontmatter* syntax.

> **☛ Note:** glossarify-md does not guarantee compatibility with plug-ins and likely won't help with issues arising due to installing and using additional third-party plug-ins.

We'll assume the following file structure:

    ${root}
       +- docs/                        (baseDir)
       +- docs-glossarified/           (outDir)
       +- node_modules/
       |- glossarify-md.conf.json
       |- remark.conf.json
       |- package.json
       '- .gitignore

**1:** Next to your `outDir` create a file `remark.conf.json`. Then add to your `glossarify-md.conf.json`:

```json
{
  "unified": {
    "rcPath": "../remark.conf.json"
  }
}
```

`rcPath` is interpreted relative to `outDir`, so you need to "step out" of it.

**2:** Then install a [remark plug-in][remark-plugin]

    npm install remark-frontmatter

**3:** Make [remark⎆][2] load the plug-in by adding to your `remark.conf.json`:

*[remark⎆][2].conf.js*

```json
{
  "plugins": {
    "remark-frontmatter": {
      "type": "yaml",
      "marker": "-"
    }
  }
}
```

1.  `remark-frontmatter` must be the name of the [npm⎆][3] package you installed before
2.  any properties of the `remark-frontmatter` object are options specific to the plug-in.

`remark.conf.json` follows the [unified configuration][unified-config] schema. You could also embed the configuration into a `glossarify-md.conf.json` by replacing `rcPath` above with `plugins`. But keep in mind that anything under the `unified` key is a different config schema and *not* subject to *[glossarify-md⎆][1]*'s config schema.

> **ⓘ remark, unified, uhh... ?**
>
> Read more on how these projects relate to glossarify-md in [Conceptual Layers][doc-conceptual-layers].

## [Writing a Plug-In](#writing-a-plug-in)

Above we saw how to install a *syntax plug-in* which are plug-ins that extend Markdown syntax itself. They operate on raw symbols and tokens and contribute new *node types* to an Abstract Syntax Tree (AST). If you aim to invent yet another non-standardized Markdown addition you might find this [remark discussion and little ASCII-art][remark-discussion] helpful. Have a look at [micromark⎆][4] and [remark⎆][2] for a reference, though.

A lot can be achieved by easier to write *tree plug-ins* which operate on and transform a markdown syntax tree (\[mdAST]\[mdast]). [glossarify-md⎆][1] itself operates on tree plug-ins, only (see [Conceptual Layers][doc-conceptual-layers]).

A tree plug-in is a function which returns a callback that when called get's passed an \[mdAST]:

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
    }):
  };
}
```

The example uses a [visit][mdast-util-visit] utility function for traversing the tree and calling a visitor on a node of `type: "link"` (to visit all nodes just pass the visitor as the second argument, instead). Once you have access to the tree you can transform it to your liking. The example will take a link node's [URL🟉][5] and add a `&visited=true` URL query parameter. Not very useful but it illustrates the concept. Also note the `options` argument which is how your plug-in would get passed its config options. For a list of [CommonMark⎆][6] node types see \[mdAST].

Here's how you can set up a plug-in project next to a [glossarify-md⎆][1] project:

1.  Make a new directory *remark-my-plugin* and initialize it as an [npm⎆][3] package.

        mkdir ./remark-my-plugin
        cd ./remark-my-plugin
        npm init

2.  Open your `package.json` and add

        "type": "module",
        "exports": "./index.js",

3.  Copy the JavaScript code sample above into `index.js`

4.  Install the [npm⎆][3] dependency required by the code sample

        npm install unist-util-visit

You're now set with your plug-in. The next part will make your package usuable on your developer machine (since it's not yet published to [npm⎆][3]):

4.  Within folder *remark-my-plugin* run

        npm link remark-my-plugin

    This creates a symlink in the system-global `node_modules` folder.

5.  `cd` into your [glossarify-md⎆][1] project and create a symlink onto the global symlink:

        npm link remark-my-plugin

You now virtually "installed" your plug-in into your [glossarify-md⎆][1] project similar as if you had run `npm install remark-my-plugin` to fetch it from the [npm⎆][3] registry.

> **Important:** Be aware that step 5 needs to be repeated whenever you ran `npm install` in your glossarify-md project).

What's left is configuring [glossarify-md⎆][1] to use it (see also previous section):

6.  Add to your *[glossarify-md⎆][1].conf.json*

        unified: {
           "plugins": ["remark-my-plugin"]
        }

7.  Run glossarify and see whether link output changed.

If you succeeded you may want to familiarize yourself with [publishing your node package][7].

[1]: https://github.com/about-code/glossarify-md "This project."

[2]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[3]: references.md#npm "Node Package Manager."

[4]: https://github.com/micromark/ "A low-level extensible implementation of the CommonMark syntax specification (parsing and tokenizing)."

[5]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[6]: https://commonmark.org "Effort on providing a minimal set of standardized Markdown syntax."

[7]: https://docs.npmjs.com/packages-and-modules
