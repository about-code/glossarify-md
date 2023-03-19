# [Installing and Configuring Plug-ins](#installing-and-configuring-plug-ins)

<!--
aliases: Plug-ins, Installing Plug-ins, installing and configuring a plug-in, install a syntax plug-in
-->

[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

The following example demonstrates how to [install][1] [remark-frontmatter 🌎][2], a syntax plug-in from the [remark 🌎][3] [plug-in ecosystem 🌎][4] which makes [glossarify-md][5] (resp. its internal remark parser) handle non-standard *Frontmatter* syntax, correctly (See [Markdown Syntax Extensions][6] for when you need a plug-in).

> **ⓘ  Note:** glossarify-md does not guarantee compatibility with plug-ins and likely won't help with issues arising due to installing and using additional third-party plug-ins.

We'll assume the following project structure:

    ${root}
       +- docs/                        (baseDir)
       +- docs-glossarified/           (outDir)
       +- node_modules/
       |- glossarify-md.conf.json
       |- package.json
       '- .gitignore

**1:** [Install][1] [remark-frontmatter 🌎][2]:

    npm install remark-frontmatter

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

Keys of the `plugins` object tell what plug-in to load and may be:

*   a name of an [npm 🌎][7] package in a global or local `node_modules` folder
*   a path to a JavaScript file [exporting][8] a plug-in function (see page [Writing a Plug-in][9])

Their value in turn are options passed to the plug-in. Read [remark-frontmatter 🌎][2] docs, to find out about available options.

> ⓘ The `unified` key embeds a [unified configuration][unified-config] object. Its schema is *not* subject to glossarify-md's own config schema, anymore. Thus, if you would like to have the configs separated a bit more clearly, then you can split them:
>
> **3:** Create a file `unified.conf.json` next to `glossarify-md.conf.json`
>
> **4:** Copy the value of `unified` to `unified.conf.json`:
>
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
>
> ```json
> {
>   "unified": {
>     "rcPath": "../unified.conf.json"
>   }
> }
> ```

If you would like to learn more about how *[unified 🌎][10]* and *[remark 🌎][3]* relate to [glossarify-md][5], read [Conceptual Layers][11]

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/install.md#install

[2]: https://npmjs.com/package/remark-frontmatter "A remark syntax plug-in supporting pseudo-standard front-matter syntax."

[3]: https://github.com/remarkjs/remark "remark is a parser and compiler project under the unified umbrella for Markdown text files in particular."

[4]: https://github.com/remarkjs/awesome-remark "A curated list of remark plug-ins."

[5]: https://github.com/about-code/glossarify-md

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/markdown-syntax-extensions.md#markdown-syntax-extensions "glossarify-md supports CommonMark and GitHub Flavoured Markdown (GFM)."

[7]: https://npmjs.com "Node Package Manager."

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0"

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/plugins-dev.md#writing-a-plug-in

[10]: https://unifiedjs.com "unified is an umbrella project around text file processing in general."

[11]: https://github.com/about-code/glossarify-md/blob/master/doc/conceptual-layers.md#internals-conceptual-layers "Conceptual layers of text processing by glossarify-md and projects contributing to each layer"
