# [Interoperability with SKOS](#interoperability-with-skos)

<!-- aliases: SKOS interoperability -->

> Readers Level: *Advanced*
>
> The term *term* can become itself confusing in this section. Therefore we'll say *model terms* if we refer to a vocabulary of technical attribute names or type names of a data model. We'll say *glossary terms* if we refer to the actual terms of a glossary (an instance of that data model).

**Since v6.0.0** glossarify-md supports [exporting][1] and [importing][2] glossaries. In addition to importing terms from files exported by glossarify-md itself it can import glossary terms from arbitrarily structured JSON documents once there are mappings of the other document's *model terms* onto "well-known" [SKOS 🌎][3] and [Dublin Core 🌎][4] model terms.

Model terms understood by glossarify-md are:

*   `skos:ConceptScheme`
*   `skos:Concept`
*   `skos:prefLabel`
*   `skos:altLabel`
*   `skos:definition`
*   `dc:title`

To see how this works a good starting point is to have a look at a glossarify-md `export` file first.

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

The [configuration][5] will make glossarify-md produce a file

*glossary.json*

```json
{
  "@context": {
    "@vocab": "https://about-code.github.io/vocab/glossarify-md/2021/10/#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "dc": "http://purl.org/dc/terms/",
    "uri": "@id",
    "type": "@type",
    "Glossary": "skos:ConceptScheme",
    "Term": "skos:Concept",
    "label": "skos:prefLabel",
    "definition": "skos:definition",
    "aliases": "skos:altLabel",
    "abstract": "dc:abstract",
    "title": "dc:title",
    "terms": {
      "@container": "@index"
    },
    "@language": "en"
  },
  "type": "Glossary",
  "uri": "https://my.org/vocab/#",
  "title": "My Glossary",
  "language": "en",
  "terms": {
      "https://my.org/vocab/#foo": {
        "uri": "https://my.org/vocab/#foo",
        "type": "Term",
        "label": "Foo",
        "definition": "Some definition of Foo. Foo is not bar.",
        "abstract": "Some definition of Foo.",
        "aliases": [ "FooBar" ]
      },
      "...": {}
  }
}
```

`glossary.json` will embed a [JSON-LD 🌎][6] `@context` document. It maps glossarify-md's own [export][1] model terminology onto [SKOS 🌎][3] and [Dublin Core 🌎][4] terms for interoperability with *other* tools understanding SKOS and Dublin Core.[^1]

[^1]: You can map glossarify-md's terms onto other model [vocabularies][7] by adding a `context` attribute to the `export` config. The attribute value is expected to be a path to a `.json` or `.jsonld` file which exposes a document with a `@context` key.

Next we'll simulate a roundtrip by [importing][2] our exported file again.

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

Of course, glossarify-md will be able to [import][2] *its own* [export][1] format again. But what if you have terms exported by another tool in another format?

> In case you just ran glossarify-md and there is an `imported.md` file in your `outDir` then delete it.

Let's drop `@context` from `glossary.json` and change it to a very different schema:

*term-data.json*

```json
{
  "uri": "https://my.org/vocab/#",
  "type": "Vocabulary",
  "heading": "My Glossary",
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

This is now a sample format *unknown* to glossarify-md. Different data formats and semantics like these are a barrier to *interoperability*. That's where [JSON-LD 🌎][6] and standardized [vocabularies][7] enter the game.

If the *unknown* application had embedded [JSON-LD 🌎][6] mappings onto [SKOS 🌎][3] and [DublinCore 🌎][4] the data could have been understood right away. Since few tools do this as of today, we'll be writing these mappings on our own:

*unknown-format.[jsonld 🌎][8]*

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

Now provide this *external context* document along the imported file:

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

What's left is to enhance glossarify-md with [JSON-LD 🌎][6] capabilities for interoperability: [^2]

    npm install jsonld

[^2]: We could have installed [jsonld 🌎][8] together with glossarify-md by default but decided against to minimize bloat for the average user.

On the next [run glossarify-md][9] will be looking for `@context` mappings

1.  *embedded into the JSON [import][2] file*
2.  or provided *externally* using `context` in the `import` config.

In our example the second applies. Glossary terms in `term-data.json` from the previously *unknown* format should now have been imported and written to a new markdown file `imported.md`.

To sum up: we've just seen an example of interoperability and how two or more applications can exchange data in their own distinct formats as soon as they provide mappings onto standardized terminology and shared semantics.

### [Additional Notes](#additional-notes)

*   glossarify-md will only [import][2] typed documents directly using [JSON-LD 🌎][6]'s `@type` attribute or mapping their `type`-like attribute onto `@type`. Unknown type names need to be mapped onto `skos:ConceptScheme` (the glossary) and  `skos:Concept` (the terms).

*   More complicated data formats may require use of some additional [JSON-LD 🌎][6] keywords from the JSON-LD Spec.

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0 Exporting makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https, when configured this way."

[3]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[4]: http://purl.org/dc/terms/ "The Dublin Core Metadata Initiative."

[5]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[6]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[8]: https://npmjs.com/package/jsonld "A JavaScript implementation of JSON-LD."

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/use-with-hugo.md#run-glossarify-md "You should now see the files in content_ copied to content where they will be picked up by Hugo."
