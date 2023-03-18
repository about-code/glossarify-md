# [Importing Terms](#importing-terms)

### [Importing from CSV](#importing-from-csv)

**Since v6.4.0** [glossarify-md][1] can [import][2] terms from CSV data. CSV is a textual serialization for tabular data and supported by most spreadsheed programs. Columns in CSV are separated by a `delimiter`, e.g. `;`:

*Example: CSV formatted text without a header row*

```csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
```

Without a header row embeded into the CSV file a `schema` mapping instructs [glossarify-md][1] on how to interprete each column (resp. `field`):

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

*   Use `@id` for the ID column
*   Use [http://www.w3.org/2004/02/skos/core#prefLabel][3] for the [term][4] column
*   Use [http://www.w3.org/2004/02/skos/core#altLabel][5] for one or more alternative [term][4] columns (aliases)
*   Use [http://www.w3.org/2004/02/skos/core#definition][6] for the [term][4] definition column

A `schema` mapping can be omitted when the CSV file embeds these as header labels in the first row:

*Example: CSV with a header row*

```csv
@id;http://www.w3.org/2004/02/skos/core#prefLabel;http://www.w3.org/2004/02/skos/core#altLabel;http://www.w3.org/2004/02/skos/core#definition

#123;My Term;Alternative Term;This Term stands for Foo
```

### [Importing from JSON (glossarify-md format)](#importing-from-json-glossarify-md-format)

```json
{
  "glossaries": [{
    "file": "./glossary.md",
    "import": {
      "file": "./terms.json"
    }
  }]
}
```

### [Importing from (arbitrary) JSON](#importing-from-arbitrary-json)

With some basic understanding about [JSON-LD 🌎][7] you may find a way to [import][2] your own JSON document format. All it takes is to add some `@context` metadata for mapping the document's JSON attribute names and types onto [SKOS 🌎][8] URIs understood by [glossarify-md][1]. Then glossarify-md's importer is able to "understand your data in terms of SKOS". See [Interoperability with SKOS and JSON-LD][9] for an in-depth example.

### [Importing terms from RDF (JSON-LD / N-Quads)](#importing-terms-from-rdf-json-ld--n-quads)

If you have described a [vocabulary][10] using [SKOS 🌎][8] and stored it in some RDF [linked data 🌎][11] format then you might equipped with linked data tooling that is able to serialize/[export][12]/convert your linked data vocabulary to N-Triples, N-Quads or [JSON-LD 🌎][7]. When serialized to JSON-LD it should be importable as easy as [importing][2] from [glossarify-md][1]'s own JSON export (see above). Importing N-Triples/N-Quads requires the file name to end with `.nq`:

```json
{
  "glossaries": [{
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

[7]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[8]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[9]: https://github.com/about-code/glossarify-md/tree/master/doc/skos-interop.md

[10]: ./glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[11]: https://www.w3.org/standards/semanticweb/ontology "See Linked Data."

[12]: https://github.com/about-code/glossarify-md/tree/master/doc/export.md
