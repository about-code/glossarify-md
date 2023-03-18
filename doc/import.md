# [Importing Terms](#importing-terms)

### [Importing from CSV](#importing-from-csv)

**Since v6.4.0** [glossarify-md][1] can [import][2] terms from CSV data. CSV is a textual serialization for tabular data and supported by most spreadsheed programs. Columns in CSV are separated by a `delimiter`, e.g. `;`:

*Example: CSV formatted text without a header row*

```csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
```

Without a header row a mapping of columns instructs [glossarify-md][1] where to find the data to [import][2]:

*   `@id` - the ID column
*   [http://www.w3.org/2004/02/skos/core#prefLabel][3] - the [term][4]
*   [http://www.w3.org/2004/02/skos/core#altLabel][5] - an alternative label
*   [http://www.w3.org/2004/02/skos/core#definition][6] - the [term][4] definition

```json
{
  "...": "..."
  "glossaries": [{
    "uri": "http://your-domain.com/vocab/#",
    "file": "./glossary.md",
    "import": {
      "file": "./terms.csv",
      "dialect": {
        "delimiter": ";",
        "doubleQuotes": true
      },
      "schema": {
        "fields": [
            { "name": "@id"},
            { "name": "ignored" },
            { "name": "http://www.w3.org/2004/02/skos/core#prefLabel" },
            { "name": "http://www.w3.org/2004/02/skos/core#altLabel" },
            { "name": "http://www.w3.org/2004/02/skos/core#definition" }
        ]
    }
  }]
}
```

A `schema` definition can be omitted when a CSV file provides the required headers (empty lines will be ignored):

*terms.csv with a headings row*

```csv
@id;http://www.w3.org/2004/02/skos/core#prefLabel;http://www.w3.org/2004/02/skos/core#altLabel;http://www.w3.org/2004/02/skos/core#definition

#123;My Term;Alternative Term;This Term stands for Foo
```

### [Importing from JSON (SKOS RDF/JSON-LD)](#importing-from-json-skos-rdfjson-ld)

*Example: [Importing][2] JSON exported by [glossarify-md][1] (optional: `uri`)*

```json
{
  "glossaries": [{
    "uri": "http://your-domain.com/vocab/#",
    "file": "./glossary.md",
    "import": {
      "file": "./terms.json"
    }
  }]
}
```

**Note:** Almost any JSON document can be turned into importable [SKOS 🌎][7] RDF/[JSON-LD 🌎][8] by providing `@context` metadata for mapping the JSON format's attribute names onto SKOS URIs supported by [glossarify-md][1]. See [Interoperability with SKOS and JSON-LD][9] for an in-depth example.

### [SKOS RDF/N-Quads](#skos-rdfn-quads)

N-Triples or N-Quads are a textual serialization of RDF Data. Assuming *terms.nq* is a serialization of [SKOS 🌎][7] RDF data then you should be able to [import][2] it with:

```json
{
  "glossaries": [{
    "uri": "http://your-domain.com/vocab/#",
    "file": "./glossary.md",
    "import": {
      "file": "./terms.nq"
    }
  }]
}
```

[1]: https://github.com/about-code/glossarify-md

[2]: https://github.com/about-code/glossarify-md/tree/master/doc/import.md

[3]: http://www.w3.org/2004/02/skos/core#prefLabel

[4]: ./glossary.md#term "Terms are headings in a markdown file which has been configured to be a glossary file."

[5]: http://www.w3.org/2004/02/skos/core#altLabel

[6]: http://www.w3.org/2004/02/skos/core#definition

[7]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[8]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[9]: https://github.com/about-code/glossarify-md/tree/master/doc/skos-interop.md
