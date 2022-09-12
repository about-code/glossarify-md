# [Managing References](#managing-references)

In order to cite a source on the web whenever using a particular [term★][1] use a glossary configuration with `linkUris: true`:

*[glossarify-md][2].conf.json*

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

Within file `./references.md` use the [term★][1] attribute `uri` to provide the source's [URL★][3]. Optionally you can add an `aliases` [term attribute★][4] to make further terms refer to a particular source and provide a tooltip for the link.

*references.md*

```md
## CommonMark
<!-- uri: https://commonmark.org -->

## Dublin Core
<!--
  uri: http://purl.org/dc/terms/
  aliases: DC, DublinCore, dc:
-->
The Dublin Core Metadata Initiative.
```

See an example by inspecting the markdown source of [\_references.md][5] or this repository's [glossarify-md.conf.json][6].

[1]: ./glossary.md#term "A term is denoted by a heading in a markdown file which is told glossarify-md to be a glossary file."

[2]: https://github.com/about-code/glossarify-md "This project."

[3]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[4]: ./glossary.md#term-attribute "Term Attributes are passed in a comment following a term's heading."

[5]: ./_references.md

[6]: ../glossarify-md.conf.json
