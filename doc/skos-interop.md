# [Interoperability with SKOS and JSON-LD](#interoperability-with-skos-and-json-ld)

[glossarify-md]: https://github.com/about-code/glossarify-md

[doc-export-import]: ../README.md#structured-export-and-import

[headingidalgorithm]: ../README.md#headingidalgorithm

[SKOS]: http://w3.org/skos/

[DC]: http://purl.org/dc/terms/

[LD]: https://www.w3.org/standards/semanticweb/ontology

[JSON-LD]: https://json-ld.org

[JSON-LD Spec]: https://www.w3.org/TR/json-ld/

[jsonld]: https://npmjs.com/package/jsonld

[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

[OWL]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/

> Readers Level: *Advanced*
>
> The term *term* can become itself confusing in this section. Therefore we'll say *model terms* if we refer to a vocabulary of type names or attribute names of a data model. We'll say *glossary terms* if we refer to the actual terms of a glossary (an instance of that data model).

**Since v6.0.0** [glossarify-md] supports [exporting and importing][doc-export-import] glossaries. In addition to importing terms from files exported by glossarify-md itself it can import glossary terms from arbitrarily structured JSON documents once there are mappings of the other document's *model terms* onto "well-known" [SKOS] and [Dublin Core][DC] model terms.

Model terms understood by [glossarify-md] are:

*   `skos:ConceptScheme`
*   `skos:Concept`
*   `skos:prefLabel`
*   `skos:altLabel`
*   `skos:definition`
*   `dc:title`

To see how this works a good starting point is to have a look at glossarify-md's own `export` files, first.

### [Exporting SKOS](#exporting-skos)

*glossarify-md.conf.json*

```json
{
  "glossaries": [{
      "uri": "http://my.org/vocab/#",
      "file": "./glossary.md",
      "export": {
        "file": "./glossary.json"
      }
  }]
}
```

`glossary.json` will embed a [JSON-LD] `@context` document. It maps glossarify-md's own export model terminology onto [SKOS] and [Dublin Core][DC] terms for interoperability with *other* tools understanding [SKOS🟉][1] and Dublin Core.[^1]

[^1]: You can embed your own mappings using the `export` config with a `context` file having an `@context` key.

Next we'll simulate a roundtrip by importing our exported file again.

### [Importing SKOS Data](#importing-skos-data)

Copy `glossary.json` which you've just exported into your input folder (*baseDir*) and change your config from `export` to `import`:

*glossarify-md.conf.json*

```json
{
  "glossaries": [{
      "import": {
        "file": "./glossary.json"
      },
      "file": "./imported.md"
  }]
}
```

Have a look at `glossary.json` again. When ignoring the `@context` metadata the actual export model of glossary-md will look like:

*glossary.json*

```json
{
  "@context": {},
  "uri": "https://my.org/vocab/#",
  "type": "Glossary",
  "title": "My Glossary",
  "language": "en",
  "terms": {
    "https://my.org/vocab/foo": {
      "uri": "https://my.org/vocab/#foo",
      "type": "Term",
      "label": "Foo",
      "definition": "Some definition of Foo. Foo is not bar.",
      "abstract": "Some definition of Foo.",
      "aliases": [ "FooBar" ]
    }
  }
}
```

Of course, [glossarify-md] will be able to import *this* (its own) export format. Now let's drop `@context` and change the document to a very different schema:

*term-data.json*

```json
{
  "uri": "https://my.org/vocab/#",
  "type": "Vocabulary",
  "heading": "Glossary",
  "language": "en",
  "vocabulary": [{
      "uri": "https://my.org/vocab/#foo",
      "type": "Entry",
      "term": "Foo",
      "longDef": "Some definition of Foo. Foo is not bar.",
      "shortDef": "Some definition of Foo.",
      "alternatives": ["FooBar"]
  }]
}
```

This is now a format *unknown* to [glossarify-md] at the moment. To import its term data we **enhance glossarify-md with [JSON-LD🟉][2] capabilitites for interoperability**:

    npm install jsonld

On the next run of [glossarify-md] it will attempt to load package [jsonld] and

1.  look for `@context` mappings *embedded into the JSON import file*
2.  look for `@context` mappings provided *externally* using `import` with a `context` file

Since very few tools embed [JSON-LD🟉][2] mappings today we'll continue to make step 2. succeed by writing our own mappings:

*unknown-format.jsonld*

```json
{
  "@context": {
    "@vocab": "http://unknown.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "dc": "http://purl.org/dc/terms/",
    "uri": "@id",
    "type": "@type",
    "Vocabulary": "skos:ConceptScheme",
    "Entry": "skos:Concept",
    "term": "skos:prefLabel",
    "longDef": "skos:definition",
    "alternatives": "skos:altLabel",
    "heading": "dc:title"
  }
}
```

Now provide the external `context` along the imported file:

*glossarify-md.conf.json*

```json
{
  "glossaries": [{
      "import": {
        "file": "./term-data.json",
        "context": "./unknown-format.jsonld"
      },
      "file": "./imported.md"
  }]
}
```

After running [glossarify-md] again there should be a file `imported.md` with the terms from `term-data.json`.

> **Important:** [glossarify-md] will only import data from *typed* documents with a `type`-like attribute whose name gets mapped to JSON-LD's `@type` and whose values get mapped to `skos:Concept` and `skos:ConceptScheme`.

More complicated data formats may require use of some additional [JSON-LD keywords][JSON-LD Spec].

[1]: ./glossary.md#skos "With SKOS the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[2]: ./glossary.md#json-ld "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."
