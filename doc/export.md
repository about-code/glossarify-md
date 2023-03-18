# [Export](#export)

**Since v6.0.0**

[Exporting][1] makes [glossarify-md 🌎][2] generate a structured representation of a markdown [glossary][3] and write it to the output directory.

## [JSON (SKOS RDF/JSON-LD)](#json-skos-rdfjson-ld)

*Example: [Export][1] terms in [glossary][3].md as ./glossary.json*

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

With \[jsonld] installed alongside [glossarify-md 🌎][2] terms can also be exported to RDF N-Quads (file extension `.nq`).

*Example: [Export][1] terms in [glossary][3].md as ./glossary.nq*

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

[1]: https://github.com/about-code/glossarify-md/tree/master/doc/export.md

[2]: https://github.com/about-code/glossarify-md "This project."

[3]: https://github.com/about-code/glossarify-md/tree/master/doc/glossary.md
