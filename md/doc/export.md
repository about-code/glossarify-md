# Export
<!--
aliases: exporting, exports
-->
**Since v6.0.0**

Exporting makes glossarify-md generate a structured representation of a markdown glossary and write it to the output directory.

## JSON (SKOS RDF/JSON-LD)

*Example: Export terms in glossary.md as ./glossary.json*

~~~json
{
  "glossaries": [{
    "uri": "http://basic.org/vocabulary/#",
    "file": "./glossary.md",
    "export": {
      "file": "./glossary.json"
    }
  }]
}
~~~

> **ⓘ** We recommend declaring a glossary `uri` when exporting. It will make glossarify-md assign each term a unique *uniform resource identifier* by combining the URI with a term's term identifier.
>
> More on the idea behind URIs read Vocabulary URIs. See config option `headingIdAlgorithm` to select an algorithm for generating term identifiers from the term itself. Use pandoc syntax `{#my-own-id}` in a term heading to specify your own term identifier.

## RDF/N-Quads

With jsonld installed alongside glossarify-md terms can also be exported to RDF N-Quads (file extension `.nq`).

*Example: Export terms in glossary.md as ./glossary.nq*

~~~json
{
  "glossaries": [{
    "uri": "http://basic.org/vocabulary/#",
    "file": "./glossary.md",
    "export": {
      "file": "./glossary.nq"
    }
  }]
}
~~~