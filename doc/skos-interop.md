# [SKOS Interoperability with JSON-LD](#skos-interoperability-with-json-ld)

> Readers Level: Advanced

[glossarify-md]: https://github.com/about-code/glossarify-md

[headingidalgorithm]: ../README.md#headingidalgorithm

[SKOS]: http://w3.org/skos/

[DC]: http://purl.org/dc/terms/

[LD]: https://www.w3.org/standards/semanticweb/ontology

[JSON-LD]: https://json-ld.org

[jsonld]: https://npmjs.com/package/jsonld

[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

[OWL]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/

**Since v6.0.0** [glossarify-md] supports `export`-ing and `import`-ing glossaries. In additon to handling its own document format glossarify-md can be enhanced to import terms from other formats, given there are [JSON-LD🟉][1] mappings onto the well-known [SKOS] vocabulary. [SKOS🟉][2] is a modeling language developed by the W3C to enable sharing and interchange of Simple Knowledge Organization Systems ([KOS🟉][3]) like Glossaries, Word Nets, Thesauri, Taxonomies, etc.

### [Exporting SKOS](#exporting-skos)

[glossarify-md's][glossarify-md] export format embeds a [JSON-LD] `@context` document, by default. It maps glossarify-md's own *export model* terminology onto [SKOS] and [Dublin Core][DC] model terms for interoperability with tools supporting [SKOS🟉][2], Dublin Core (optional) and [JSON-LD🟉][1]. You can embed your own JSON-LD `@context` mappings if you need to using `export` with `context`:

```json
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
```

> **Note:** The example uses an `export` array to indicate that you can write multiple export files with different JSON-LD contexts at once.

A `context` document must contain the `@context` key:

*embed.jsonld*

```json
{
  "@context": {}
}
```

### [Importing SKOS](#importing-skos)

Without [jsonld] capabilities [glossarify-md] can only understand and import its own JSON export format. However you can `npm install jsonld` and when glossarify-md detects [jsonld] it will look for `@context` mappings of that unknown format onto well-known [SKOS🟉][2] terms. If the data source providing the JSON file does not contain any such mappings you could write and provide your own mappings alongside the JSON file using `import` with `context`:

```json
{
  "glossaries": [{
      "import": {
        "file": "./unknown-format.json",
        "context": "./unknown-format-to-skos-mappings.jsonld"
      },
      "file": "./glossary.md" // generated
  }]
}
```

> **Note:** glossarify-md only evaluates the SKOS terms that can be found in its export format, as well.

Like for exports import `context` documents must contain the `@context` key, too.

[1]: ./glossary.md#json-ld "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[2]: ./glossary.md#skos "With SKOS the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[3]: ./glossary.md#kos-knowledge-organization-systems "Glossaries are considered a kind of Knowledge Organisation System (KOS) which organizes knowledge as a list of terms and term definitions."
