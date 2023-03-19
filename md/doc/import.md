# Importing Terms
<!--
aliases: Import, importing, imports
-->
[strip-markdown]: https://npmjs.com/package/strip-markdown

> ⚠ **Important:** glossarify-md is able to import terms and definitions from a remote location using `https`. It will try to remove any Markdown and HTML from imported data using [strip-markdown](https://npmjs.com/package/strip-markdown). Nevertheless, as a rule of thumb, **never import from untrusted sources**.
> <details>
> Loading <strong>files from a remote location could enable a remote entity to embed malicious code</strong>, execute such code in the runtime context of glossarify-md or make glossarify-md embed it into <em>your</em> output files. <strong>Consider downloading files first and after review import them statically from within your project.</strong>
</details>

----

### From CSV

**Since v6.4.0**

CSV is a textual serialization for tabular data and supported by most spreadsheed programmes. Columns in CSV are separated by a `delimiter`.

*Example: CSV formatted tabular data delimited by `;` and without a header row*
~~~csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
~~~

Without a header row embedded into the CSV data a `schema` mapping is required to tell glossarify-md where to find glossary columns (resp. `fields`):

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
            { "name": "" },
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

### From JSON (glossarify-md exports)

**Since v6.0.0**

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

### From JSON (arbitrary)

~~~json
{
  "glossaries": [{
    "file": "./glossary.md",
    "import": {
      "file": "./terms.json",
      "context": "./mapping.jsonld"
    }
  }]
}
~~~

Importing from arbitrary data models and JSON serializations is likely to require mappings onto SKOS types and attributes. See Interoperability with SKOS and JSON-LD for an in-depth example.

### From RDF + SKOS

**Since v6.0.0**

If you have an SKOS description of a glossary or taxonomy stored in some RDF linked data store then you might find linked data tooling that is able to export/convert/serialize your linked data vocabulary to **N-Triples, N-Quads or JSON-LD**.

- Importing from JSON-LD should work similar to importing glossarify-md's own JSON exports
- Importing N-Triples/N-Quads requires the file name to end with `.nq`

*Example: Import RDF + SKOS from an N-Quads serialization:*
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


