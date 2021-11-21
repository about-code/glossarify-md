# Installing Syntax Plug-ins

[doc-conceptual-layers]: ./conceptual-layers.md
[CommonMark]: https://www.commonmark.org
[glossarify-md]: https://github.com/about-code/glossarify-md
[mdast]: https://github.com/syntax-tree/mdast
[mdast-util-visit]: https://npmjs.com/package/mdast-util-visit
[micromark]: https://github.com/micromark/
[remark]: https://github.com/remarkjs/remark
[remark-discussion]: https://github.com/remarkjs/remark/discussions/869#discussioncomment-1602674
[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter
[remark-plugin]: https://github.com/remarkjs/awesome-remark
[unified]: https://unifiedjs.com
[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md


The following example demonstrates how to install a [remark plug-in][remark-plugin]. The plug-in will extend *glossarify-md*'s markdown parser [remark]  with support for *Frontmatter* syntax.

> **☛ Note:** *glossarify-md* does not guarantee compatibility with plug-ins and likely won't help with issues arising due to installing and using additional third-party plug-ins.

We'll assume the following file structure:

~~~
${root}
   +- docs/                        (baseDir)
   +- docs-glossarified/           (outDir)
   +- node_modules/
   |- glossarify-md.conf.json
   |- remark.conf.json
   |- package.json
   '- .gitignore
~~~

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

~~~
npm install remark-frontmatter
~~~

**3:** Make remark load the plug-in by adding to your `remark.conf.json`:

*remark.conf.js*
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

1. `remark-frontmatter` must be the name of the npm package you installed before
2. any properties of the `remark-frontmatter` object are options specific to the plug-in.

`remark.conf.json` follows the [unified configuration][unified-config] schema. You could also embed the configuration into a `glossarify-md.conf.json` by replacing `rcPath` above with `plugins`. But keep in mind that anything under the `unified` key is a different config schema and *not* subject to *[glossarify-md]*'s config schema.

> **ⓘ [remark], [unified], uhh... ?**
>
> Read more on how these projects relate to *glossarify-md* in [Conceptual Layers][doc-conceptual-layers].

## Writing a Plug-In

Above we saw how to install a *syntax plug-in* which are plug-ins that extend Markdown syntax itself. They operate on raw symbols and tokens and contribute new *node types* to an Abstract Syntax Tree (AST). If you aim to invent yet another non-standardized Markdown addition you might find this [remark discussion and little ASCII-art][remark-discussion] helpful. Have a look at [micromark] and [remark] for a reference, though.

A lot can be achieved by easier to write *tree plug-ins* which operate on and transform a markdown syntax tree ([mdAST][mdast]). *glossarify-md* itself operates on tree plug-ins, only (see [Conceptual Layers][doc-conceptual-layers]).

A tree plug-in is a function which returns a callback that when called get's passed an [mdAST]:

~~~js
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
~~~

The example uses a [visit][mdast-util-visit] utility function for traversing the tree and calling a visitor on a node of `type: "link"` (to visit all nodes just pass the visitor as the second argument, instead). Once you have access to the tree you can transform it to your liking. The example will take a link node's URL and add a `&visited=true` URL query parameter. Not very useful but it illustrates the concept. Also note the `options` argument which is how your plug-in would get passed its config options. For a list of [CommonMark] node types see [mdAST].

Here's how you can set up a plug-in project:

1. Make a new directory *remark-my-plugin* and step into
   ~~~
   npm init
   ~~~
2. Open your package.json and add
   ~~~
   "type": "module",
   "exports": "./index.js",
   ~~~
3. Copy above plug-in code into index.js
   ~~~
   npm install unist-util-visit
   ~~~

You're now set with your plug-in. Next let's link the sources into the `node_modules` folder of a *glossarify-md* project:

4. Within folder *remark-my-plugin* run `npm link` (creates a symlink in the global node_modules folder)
5. `cd` into your *glossarify-md* project now and there run
   ~~~
   npm link remark-my-plugin (creates a symlink onto the global symlink)
   ~~~

You now virtually "installed" your plug-in similar as if you had run `npm install` to fetch it from a npm registry.**Important:** Be aware that the latter link needs to be re-established after you ran `npm install` in your *glossarify-md* project, so don't do that now).

What's left is configuring *glossarify-md* to use it (see also previous section):

6. Add to your *glossarify-md.conf.json*

   ~~~
   unified: {
      "plugins": ["remark-my-plugin"]
   }
   ~~~

7. Run glossarify and see whether link output changed.

If you succeeded you may want to familiarize yourself with [publishing your node package](https://docs.npmjs.com/packages-and-modules).
