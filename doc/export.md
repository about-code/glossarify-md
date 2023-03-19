# [Export](#export)

<!--
aliases: exporting, exports
-->

**Since v6.0.0**

[Exporting][1] makes [glossarify-md][2] generate and write a structured representation of a markdown glossary to the output directory.

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

> **ⓘ** We recommend declaring a glossary `uri` when exporting. It will make glossarify-md assign each term a unique *uniform resource identifier* by combining the URI with a term's term identifier.
>
> More on the idea behind URIs read Vocabulary URIs. See config option `headingIdAlgorithm` to select an algorithm for generating term identifiers from the term itself. Use pandoc syntax `{#my-own-id}` in a term heading to specify your own term identifier.

## [RDF/N-Quads](#rdfn-quads)

With [jsonld 🌎][3] installed alongside [glossarify-md][2] terms can also be exported to RDF N-Quads (file extension `.nq`).

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

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0"

[2]: https://github.com/about-code/glossarify-md

[3]: https://npmjs.com/package/jsonld "A JavaScript implementation of JSON-LD."
