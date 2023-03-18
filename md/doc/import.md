# Importing Terms

### Importing from CSV

**Since v6.4.0** glossarify-md can import terms from CSV data. CSV is a textual serialization for tabular data and supported by most spreadsheed programs. Columns in CSV are separated by a `delimiter`, e.g. `;`:

*Example: CSV formatted text without a header row*
~~~csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
~~~

Without a header row a mapping of columns instructs glossarify-md where to find the data to import:

- `@id` - the ID column
- http://www.w3.org/2004/02/skos/core#prefLabel - the term
- http://www.w3.org/2004/02/skos/core#altLabel - an alternative label
- http://www.w3.org/2004/02/skos/core#definition - the term definition

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

A `schema` definition can be omitted when a CSV file provides the required headers (empty lines will be ignored):

*terms.csv with a headings row*
~~~csv
@id;http://www.w3.org/2004/02/skos/core#prefLabel;http://www.w3.org/2004/02/skos/core#altLabel;http://www.w3.org/2004/02/skos/core#definition

#123;My Term;Alternative Term;This Term stands for Foo
~~~

### Importing from JSON (SKOS RDF/JSON-LD)

*Example: Importing JSON exported by glossarify-md (optional: `uri`)*

~~~json
{
  "glossaries": [{
    "uri": "http://your-domain.com/vocab/#",
    "file": "./glossary.md",
    "import": {
      "file": "./terms.json"
    }
  }]
}
~~~



**Note:** Almost any JSON document can be turned into importable SKOS RDF/JSON-LD by providing `@context` metadata for mapping the JSON format's attribute names onto SKOS URIs supported by glossarify-md. See Interoperability with SKOS and JSON-LD for an in-depth example.

### SKOS RDF/N-Quads

N-Triples or N-Quads are a textual serialization of RDF Data. Assuming *terms.nq* is a serialization of SKOS RDF data then you should be able to import it with:

~~~json
{
  "glossaries": [{
    "uri": "http://your-domain.com/vocab/#",
    "file": "./glossary.md",
    "import": {
      "file": "./terms.nq"
    }
  }]
}
~~~


