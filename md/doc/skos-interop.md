# SKOS Interoperability

> Readers Level: Advanced

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

**Since v6.0.0** [glossarify-md] supports [`export`-ing and `import`-ing][doc-export-import] glossaries. In additon to its own export model format it can import glossary terms from other JSON documents once there are mappings from the other model's terms onto *"well-known"* SKOS vocabulary. [SKOS] and [Dublin Core][DC] terms understood by [glossarify-md] are:

- `skos:ConceptScheme`
- `skos:Concept`
- `skos:prefLabel`
- `skos:altLabel`
- `skos:definition`
- `dc:title`

To find out how this could help you a good starting point is to having a look at glossarify-md's own export files, first.

### Exporting SKOS

*glossarify-md.conf.json*
~~~json
{
  "glossaries": [{
      "uri": "http://my.org/vocab/#",
      "file": "./glossary.md",
      "export": {
        "file": "./glossary.json"
      }
  }]
}
~~~

`glossary.json` will embed a [JSON-LD] `@context` document. It maps *glossarify-md's own export model terminology* onto [SKOS] and [Dublin Core][DC] terms for interoperability with *other* tools understanding SKOS and Dublin Core. Next we'll simulate a roundtrip by importing our exported file again.

> **Advanced:** Given you need to embed your own `@context` mappings, then use the `export` config with a `context` file containing an `@context` key.
>

### Importing SKOS Data

Copy `glossary.json` which you've just exported into your input folder (*baseDir*) and change your config from `export` to `import`:

*glossarify-md.conf.json*
~~~json
{
  "glossaries": [{
      "import": {
        "file": "./glossary.json"
      },
      "file": "./imported.md"
  }]
}
~~~

Have a look at `glossary.json` again. When ignoring the `@context` metadata the actual export model of glossary-md will look like:

*glossary.json*
~~~json
{
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
~~~

Of course, [glossarify-md] will be able to import *this* (its own) export format. Now let's change the document to a very different schema:

*term-data.json*
~~~json
{
  "uri": "https://my.org/vocab/#",
  "type": "Vocabulary",
  "title": "Some other document",
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
~~~

This is now a format *unknown* to [glossarify-md] at the moment. To import its term data we **enhance glossarify-md with JSON-LD capabilitites for interoperability**:

~~~
npm install jsonld
~~~

On the next run of [glossarify-md] it will attempt to load package [jsonld] and

1. look for `@context` mappings onto SKOS *embedded into the JSON import file*
2. look for `@context` mappings provided *externally* using `import` with a `context` file

Since very few tools export terms with JSON-LD mappings to date we'll continue to make step 2. succeed by writing own mappings:

*unknown-format.jsonld*
~~~json
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
    "title": "dc:title"
  }
}
~~~

Now provide the external `context`:

*glossarify-md.conf.json*
~~~json
{
  "glossaries": [{
      "import": {
        "file": "./term-data.json",
        "context": "./unknown-format.jsonld"
      },
      "file": "./imported.md"
  }]
}
~~~

After running [glossarify-md] again there should be a file `imported.md` with the terms from `term-data.json`.

> **Important:** [glossarify-md] will only import *typed* data which provides some kind of `type` like property whose values can be mapped onto `skos:Concept` and `skos:ConceptScheme`.

More complicated data formats may require use of some additional [JSON-LD keywords][JSON-LD Spec].
