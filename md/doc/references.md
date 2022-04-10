# Managing References

In order to cite a source on the web whenever using a particular term, use a
glossary configuration with `linkUris: true`:

*glossarify-md.conf.json*
~~~json
{
  "glossaries": [
    {
      "file": "./references.md",
      "linkUris": true
    }
  ]
}
~~~

Within file `./references.md` use the `uri` term attribute to provide the source's URL. Optionally you can add an `aliases` term attribute to make further terms refer to a particular source and provide a tooltip for the link.

*references.md*
~~~md
## CommonMark
<!--{ "uri": "https://commonmark.org" }-->

## Dublin Core
<!--{
    "uri": "http://purl.org/dc/terms/",
    "aliases": "DC, DublinCore, dc:"
}-->
The Dublin Core Metadata Initiative.
~~~

See an example by inspecting the markdown source of [_references.md](./_references.md) or this repository's [glossarify-md.conf.json](../glossarify-md.conf.json).
