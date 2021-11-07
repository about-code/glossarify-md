# Markdown Syntax Extensions

[doc-conceptual-layers]: ./conceptual-layers.md
[CommonMark]: https://www.commonmark.org
[GFM]: https://github.github.com/gfm/
[glossarify-md]: https://github.com/about-code/glossarify-md
[mdast]: https://github.com/syntax-tree/mdast
[micromark]: https://github.com/micromark/
[remark]: https://github.com/remarkjs/remark
[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter
[remark-plugins]: https://github.com/remarkjs/awesome-remark
[unified]: https://unifiedjs.com
[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md
[vuepress]: https://vuepress.vuejs.org

> **ⓘ Since v5.0.0**

[glossarify-md] supports [CommonMark] and [GitHub Flavoured Markdown (GFM)][GFM]. Syntax not covered by these specifications may have no or worse, a wrong representation in the tool's [Abstract Syntax Tree][mdast]. As a consequence it may not make it correctly into output documents. For example *Frontmatter* syntax is a Markdown syntax extension popularized by many static site generators:

*Frontmatter Syntax*

```
---
key: This is a frontmatter
---
```

Without special support for it [CommonMark] compliant parsers like our [remark] parser will interpret the line of trailing dashes as *heading* markers and the text before them as *heading text*. So to make our parser aware of frontmatter syntax we need to enhance it. **Since v5.0.0** we have opened [glossarify-md] to the [remark plug-in ecosystem][remark-plugins] and its support of additional syntaxes and tools.

## Installing a Syntax Plug-in

> **☛ Note:** glossarify-md does not guarantee compatibility with plug-ins and likely won't help with issues arising due to installing and using additional plug-ins.

Next to your `outDir` create a file `remark.conf.json`. Then add to your `glossarify-md.conf.json`:

```json
{
  "unified": {
    "rcPath": "../remark.conf.json"
  }
}
```

`rcPath` is interpreted relative to `outDir`. Then install a remark plug-in

~~~
npm install remark-frontmatter
~~~

and make remark load the plug-in by adding to your `remark.conf.json`:

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

`remark.conf.json` follows the [unified configuration][unified-config] schema:

- `remark-frontmatter` must be the name of the npm package you installed before
- any properties of the object are specific to the plug-in.

You could also embed the configuration into a glossarify-md.conf.json by replacing `rcPath` with the `plugins` key. But keep in mind that anything under the `unified` key is a different config schema and *not* subject to the [glossarify-md] config schema.

> **ⓘ [remark], [unified], uhh... ?**
>
> Read more on how these projects relate to glossarify-md in our addendum [Conceptual Layers][doc-conceptual-layers].
