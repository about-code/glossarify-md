# Installing Plug-ins

[doc-conceptual-layers]: ./conceptual-layers.md
[mdast-util-visit]: https://npmjs.com/package/mdast-util-visit
[remark-discussion]: https://github.com/remarkjs/remark/discussions/869#discussioncomment-1602674
[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter
[remark-plugin]: https://github.com/remarkjs/awesome-remark
[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md
[verdaccio]: https://npmjs.com/package/verdaccio


The following example demonstrates how to install [remark-frontmatter], a [remark plug-in][remark-plugin] to make glossarify-md handle non-standard *Frontmatter* syntax, correctly.

> **ⓘ  Note:** glossarify-md does not guarantee compatibility with plug-ins and likely won't help with issues arising due to installing and using additional third-party plug-ins.

We'll assume the following project structure:

~~~
${root}
   +- docs/                        (baseDir)
   +- docs-glossarified/           (outDir)
   +- node_modules/
   |- glossarify-md.conf.json
   |- package.json
   '- .gitignore
~~~

**1:** Install [remark-frontmatter]:

~~~
npm install remark-frontmatter
~~~

**2:** In your `glossarify-md.conf.json` add:

```json
{
  "unified": {
    "plugins": {
      "remark-frontmatter": {
        "type": "yaml",
        "marker": "-"
      }
    }
  }
}
```

Keys of the `plugins` object tell what to load and may be:
- *names of npm packages*
- *paths of JavaScript modules.*

Their value in turn are options passed to the plug-in. Read [remark-frontmatter] docs, to find out about available options.

> ⓘ The `unified` key embeds a [unified configuration][unified-config] object. Its schema is *not* subject to glossarify-md's own config schema, anymore. Thus, if you would like to have the configs separated a bit more clearly, then you can split them:
>
> **3:** Create a file `unified.conf.json` next to `glossarify-md.conf.json`
>
> **4:** Copy the value of `unified` to `unified.conf.json`:
> ```json
> {
>   "plugins": {
>     "remark-frontmatter": {
>       "type": "yaml",
>       "marker": "-"
>     }
>   }
> }
> ```
>
> **5:** In `glossarify-md.conf.json` replace `plugins` with `rcPath` (rooted in `outDir`, so you need to step out):
> ```json
> {
>   "unified": {
>     "rcPath": "../unified.conf.json"
>   }
> }
> ```
>
> If you would like to learn more about how *unified* and *remark* relate to glossarify-md, read [Conceptual Layers][doc-conceptual-layers].

## Writing a Plug-In

### Syntax Plug-Ins
Syntax Plug-ins extend Markdown syntax itself, like [remark-frontmatter], for example. They contribute new *node types* to an internal Abstract Syntax Tree (AST). Further they provide a tokenizer to parse and a serializer to write markdown files. Writing syntax plug-ins is a bit more elaborate. At this point we like to refer you to the documentation of micromark and mdAst. When exploring these projects you might find this [description of the overall process][remark-discussion] helpful.

### Tree-Plug-Ins
*Tree plug-ins* operate on a markdown syntax tree (mdAST). They are much easier to write and use CommonMark and GFM syntax and respective AST node types to do their job. Basically they inspect, add, remove or resort AST nodes. glossarify-md operates on tree plug-ins, almost only (see [Conceptual Layers][doc-conceptual-layers]).

A tree plug-in is a function which returns a callback that when called get's passed an mdAst root node (`tree`):

*remark-my-plug-in.js*
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
    });
  };
}
~~~

The example simply adds a `&visited=true` URL query parameter to each Markdown link in a document.

It uses a [visit][mdast-util-visit] utility function with a filter argument (2) and visitor callback argument (3). The filter argument can be the name of a node type or a filter function which gets passed a node and is expected to return a boolean.  For a list of CommonMark node types see mdAst. Eventually, the plug-in function returns the tree's root node again.
Note the `options` argument: this is how your plug-in would get passed its config options (see [Installing Plug-Ins](#installing-plug-ins)).

Let's save the plug-in to *plugins/remark-my-plug-in.js* next to `outDir`:

~~~
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
~~~

In your `glossarify-md.conf.json` add:

~~~json
{
  "unified": {
    "plugins": {
      "../plugins/remark-my-plug-in.js": { "your": "options" }
    }
  }
}
~~~

The plug-in path is rooted in `outDir` so you need to step out.
That's it. Run glossarify-md again and check the links in Markdown files in your output directory.


## Writing a Plug-in Package

If you aim for publishing a plug-in, here's how you could set up a plug-in package project next to a glossarify-md project:

1. Make a new directory *remark-my-plug-in* next to `${root}` and initialize it as an npm package.

   ~~~
   mkdir ./remark-my-plug-in
   cd ./remark-my-plug-in
   npm init
   ~~~

2. Open your `package.json` and add

   ~~~
   "type": "module",
   "exports": "./index.js",
   ~~~

3. Copy the JavaScript code sample or `remark-my-plug-in.js` (see prev. section) to a file `index.js`
4. Install the npm dependency required by the code sample

   ~~~
   npm install unist-util-visit
   ~~~

5. You're now set with your plug-in. This step will make your package usuable, *locally*, with symlinking (since it's not yet published to npm).

   `cd` into your glossarify-md project and create another symlink onto the global symlink:

   ~~~
   npm link ../remark-my-plug-in
   ~~~

   > **Important:** Ths step needs to be repeated whenever you ran `npm install` in your glossarify-md project.

   You now virtually "installed" your plug-in to your glossarify-md project similar as if you had run `npm install remark-my-plug-in` to fetch it from the npm registry. What's left is configuring glossarify-md to use it (see also previous section):

7. Add to your *glossarify-md.conf.json*

   ~~~
   unified: {
      "plugins": {
        "remark-my-plug-in": { "your": "options" }
      }
   }
   ~~~

8. Delete your `outDir`, run glossarify-md again and see whether link output changed.

## Publishing a Plug-in Package

Prior to publishing check what would get published:

~~~
npm pack
~~~

The command creates a `tar.gz` file. Inspect its contents. Optionally, use a `files` whitelist in `package.json` to select which files should go into a package.

> Prior to publishing to the official npm registry, you may also find setting up a test registry on `localhost` useful. See [verdaccio], for an example.

More see official NPM docs on [publishing your node package](https://docs.npmjs.com/packages-and-modules).
