# Installing Syntax Plug-ins

[doc-conceptual-layers]: ./conceptual-layers.md
[CommonMark]: https://www.commonmark.org
[glossarify-md]: https://github.com/about-code/glossarify-md
[remark]: https://github.com/remarkjs/remark
[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter
[remark-plugin]: https://github.com/remarkjs/awesome-remark
[unified]: https://unifiedjs.com
[unified-config]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

The following example demonstrates how to install a [remark plug-in][remark-plugin]. The plug-in will extend glossarify-md's markdown parser [remark]  with support for *Frontmatter* syntax.

> **☛ Note:** glossarify-md does not guarantee compatibility with plug-ins and likely won't help with issues arising due to installing and using additional third-party plug-ins.

**1:** Next to your `outDir` create a file `remark.conf.json`. Then add to your `glossarify-md.conf.json`:

```json
{
  "unified": {
    "rcPath": "../remark.conf.json"
  }
}
```

`rcPath` is interpreted relative to `outDir`.

**2:** Then install a [remark plug-in][remark-plugin]

~~~
npm install remark-frontmatter
~~~

**3:** Make remark load the plug-in by adding to your `remark.conf.json`:

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
> Read more on how these projects relate to glossarify-md in [Conceptual Layers][doc-conceptual-layers].
