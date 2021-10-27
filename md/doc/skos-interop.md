# Exporting and Importing SKOS Vocabularies

[glossarify-md]: https://github.com/about-code/glossarify-md
[headingidalgorithm]: ../README.md#headingidalgorithm
[SKOS]: http://w3.org/skos/
[LD]: https://www.w3.org/standards/semanticweb/ontology
[JSON-LD]: https://json-ld.org
[jsonld]: https://npmjs.com/package/jsonld
[vocabularies]: https://www.w3.org/standards/semanticweb/ontology
[OWL]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/

**Since v6.0.0** [glossarify-md] supports `export`ing and `import`ing glossaries:

> Readers Level: Advanced

SKOS is a modeling language developed by the W3C to share Simple Knowledge Organization Systems (KOS) like Glossaries, Word Nets, Thesauri, Taxonomies, etc.

### Exporting SKOS

[glossarify-md's][glossarify-md] export format embeds a [JSON-LD] `@context` document, like the one below:

~~~json
{
  "@context": {
    "@vocab": "https://about-code.github.io/vocab/glossarify-md/2021/10/#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "dc": "http://purl.org/dc/terms/",
    "Glossary": {
      "@id": "skos:ConceptScheme",
      "@context": {
        "title": "dc:title",
        "terms": { "@container": "@index" }
      }
    },
    "": "...",
}
~~~

 The document maps glossarify-md's own *export model* terminology onto SKOS and Dublin Core model terms for interoperability with tools supporting SKOS, (Dublin Core) and JSON-LD. You can embed a different JSON-LD `@context` document should you need to:

~~~json
{
  "glossaries": [{
      "uri": "http://advanced.org/vocabulary/",
      "file": "./glossary.md",
      "export": [{
        "file": "./glossary.json",
        "context": "./embed.jsonld"
      }]
  }]
}
~~~

> **Note:** The example uses an `export` array to indicate that you can write multiple export files with different JSON-LD contexts all at once.

### Importing SKOS

By default [glossarify-md] can only understand and import its own JSON export format. However you can `npm install` [jsonld] and when glossarify-md detects it, it will try to parse an imported JSON file using JSON-LD which enables other data formats, too, given they embed JSON-LD mappings onto SKOS, as well. If not you could write and provide your own mappings, externally, using an import `context`:

~~~json
{
  "glossaries": [{
      "import": {
        "file": "./unknown-format.json",
        "context": "./unknown-format-to-skos-mappings.jsonld"
      },
      "file": "./glossary.md" // generated from import
  }]
}
~~~

**Note:** glossarify-md only evaluates the SKOS terms that can be found in its export format, as well.
