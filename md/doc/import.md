# Importing Terms

### Importing from CSV

**Since v6.4.0** glossarify-md can import terms from CSV data. CSV is a textual serialization for tabular data and supported by most spreadsheed programs. Columns in CSV are separated by a `delimiter`, e.g. `;`:

*Example: CSV formatted text without a header row*
~~~csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
~~~

Without a header row embeded into the CSV file a `schema` mapping instructs glossarify-md on how to interprete each column (resp. `field`):

~~~json
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
~~~

- Use `@id` for the ID column
- Use http://www.w3.org/2004/02/skos/core#prefLabel for the term column
- Use http://www.w3.org/2004/02/skos/core#altLabel for one or more alternative term columns (aliases)
- Use http://www.w3.org/2004/02/skos/core#definition for the term definition column

A `schema` mapping can be omitted when the CSV file embeds these as header labels in the first row:

*Example: CSV with a header row*
~~~csv
@id;http://www.w3.org/2004/02/skos/core#prefLabel;http://www.w3.org/2004/02/skos/core#altLabel;http://www.w3.org/2004/02/skos/core#definition

#123;My Term;Alternative Term;This Term stands for Foo
~~~

### Importing from JSON (glossarify-md format)

~~~json
{
  "glossaries": [{
    "file": "./glossary.md",
    "import": {
      "file": "./terms.json"
    }
  }]
}
~~~

### Importing from (arbitrary) JSON

With some basic understanding about JSON-LD you may find a way to import your own JSON document format. All it takes is to add some `@context` metadata for mapping the document's JSON attribute names and types onto SKOS URIs understood by glossarify-md. Then glossarify-md's importer is able to "understand your data in terms of SKOS". See Interoperability with SKOS and JSON-LD for an in-depth example.

### Importing terms from RDF (JSON-LD / N-Quads)

If you have described a vocabulary using SKOS and stored it in some RDF linked data format then you might equipped with linked data tooling that is able to serialize/export/convert your linked data vocabulary to N-Triples, N-Quads or JSON-LD. When serialized to JSON-LD it should be importable as easy as importing from glossarify-md's own JSON export (see above). Importing N-Triples/N-Quads requires the file name to end with `.nq`:

~~~json
{
  "glossaries": [{
    "file": "./glossary.md",
    "import": {
      "file": "./terms.nq"
    }
  }]
}
~~~


