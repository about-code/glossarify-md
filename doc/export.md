# [Export](#export)

<!--
aliases: exporting, exports
-->

**Since v6.0.0**

[Exporting][1] makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory.

## [JSON (SKOS RDF/JSON-LD)](#json-skos-rdfjson-ld)

*Example: [Export][1] terms in glossary.md as ./glossary.json*

```json
{
  "glossaries": [{
    "uri": "http://basic.org/vocabulary/#",
    "file": "./glossary.md",
    "export": {
      "file": "./glossary.json"
    }
  }]
}
```

We recommend declaring a glossary `uri` when [exporting][1]. It will make glossarify-md assign each term a unique *uniform resource identifier* by combining the [URI][2] with a term's term identifier.

More on the idea behind URIs read [URIs as Identifiers for Definitions of Meaning][3]. See also [config option][4] `headingIdAlgorithm` to select an algorithm for generating term identifiers from the term itself or use [pandoc 🌎][5] syntax `{#my-own-id}` in a term heading to specify your own term identifier.

## [RDF/N-Quads](#rdfn-quads)

With [jsonld 🌎][6] installed alongside glossarify-md terms can also be exported to RDF N-Quads (file extension `.nq`).

*Example: [Export][1] terms in glossary.md as ./glossary.nq*

```json
{
  "glossaries": [{
    "uri": "http://basic.org/vocabulary/#",
    "file": "./glossary.md",
    "export": {
      "file": "./glossary.nq"
    }
  }]
}
```

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0 Exporting makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/vocabulary-uris.md#uris-as-identifiers-for-definitions-of-meaning "Consider a term skin."

[4]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[5]: https://pandoc.org "See pandoc."

[6]: https://npmjs.com/package/jsonld "A JavaScript implementation of JSON-LD."
