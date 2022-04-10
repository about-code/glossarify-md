# [Managing References](#managing-references)

In order to cite a source on the web whenever using a particular [term🟉][1], use a
glossary configuration with `linkUris: true`:

*[glossarify-md…][2].conf.json*

```json
{
  "glossaries": [
    {
      "file": "./references.md",
      "linkUris": true
    }
  ]
}
```

Within file `./references.md` use the `uri` [term🟉][1] attribute to provide the source's [URL🟉][3]. Optionally you can add an `aliases` term attribute to make further terms refer to a particular source and provide a tooltip for the link.

*references.md*

```md
## CommonMark
<!--{ "uri": "https://commonmark.org" }-->

## Dublin Core
<!--{
    "uri": "http://purl.org/dc/terms/",
    "aliases": "DC, DublinCore, dc:"
}-->
The Dublin Core Metadata Initiative.
```

See an example by inspecting the markdown source of [\_references.md][4] or this repository's [glossarify-md.conf.json][5].

[1]: ./glossary.md#term "A term is a heading in a markdown file which is passed to glossarify-md as a glossary."

[2]: https://github.com/about-code/glossarify-md "This project."

[3]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[4]: ./_references.md

[5]: ../glossarify-md.conf.json
