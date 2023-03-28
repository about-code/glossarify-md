# [Importing Terms](#importing-terms)

<!--
aliases: Import, importing, imports
-->

[strip-markdown]: https://npmjs.com/package/strip-markdown

> **⚠ Important:** glossarify-md is able to import terms and definitions from a remote location using `https`, when configured this way. It will try to remove any Markdown and HTML from imported data using [strip-markdown][strip-markdown]. Nevertheless, as a rule of thumb, **never blindly import from untrusted sources**.
>
> <details>
> Loading <strong>files from a remote location could enable a remote entity to embed malicious code</strong>, execute such code in the runtime context of glossarify-md or make glossarify-md embed it into <em>your</em> output files. <strong>Consider downloading files first and after review import them statically from within your project.</strong>

</details>

***

### [From CSV](#from-csv)

**Since v7.0.0**

CSV is a textual serialization for tabular data and supported by most spreadsheed programmes. Columns in CSV are separated by a `delimiter`.

*Example: CSV formatted tabular data delimited by `;` and without a header row*

```csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
```

Without a header row embedded into the CSV data a `schema` mapping is required to tell [glossarify-md][1] where to find glossary columns (resp. `fields`):

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
            { "name": "" },
            { "name": "http://www.w3.org/2004/02/skos/core#prefLabel" },
            { "name": "http://www.w3.org/2004/02/skos/core#altLabel" },
            { "name": "http://www.w3.org/2004/02/skos/core#definition" }
        ]
    }
  }]
}
```

*   Use `@id` for the ID column
*   Use [http://www.w3.org/2004/02/skos/core#prefLabel][2] for the [term][3] column
*   Use [http://www.w3.org/2004/02/skos/core#altLabel][4] for one or more alternative [term][3] columns ([aliases][5])
*   Use [http://www.w3.org/2004/02/skos/core#definition][6] for the [term][3] definition column

A `schema` mapping can be omitted when the CSV file embeds these as header labels in the first row:

*Example: CSV with a header row*

```csv
@id;http://www.w3.org/2004/02/skos/core#prefLabel;http://www.w3.org/2004/02/skos/core#altLabel;http://www.w3.org/2004/02/skos/core#definition

#123;My Term;Alternative Term;This Term stands for Foo
```

### [From JSON (glossarify-md exports)](#from-json-glossarify-md-exports)

**Since v6.0.0**

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

### [From JSON (arbitrary)](#from-json-arbitrary)

```json
{
  "glossaries": [{
    "file": "./glossary.md",
    "import": {
      "file": "./terms.json",
      "context": "./mapping.jsonld"
    }
  }]
}
```

[Importing][7] from arbitrary data models and JSON serializations is likely to require mappings onto [SKOS 🌎][8] types and attributes. See Interoperability with [SKOS 🌎][8] and [JSON-LD 🌎][9] for an in-depth example.

### [From RDF + SKOS](#from-rdf--skos)

**Since v6.0.0**

If you have an [SKOS 🌎][8] description of a glossary or taxonomy stored in some RDF [linked data 🌎][10] store then you might find [linked data 🌎][10] tooling that is able to [export][11]/convert/serialize your [linked data 🌎][10] [vocabulary][12] to **N-Triples, N-Quads or [JSON-LD 🌎][9]**.

*   [Importing][7] from [JSON-LD 🌎][9] should work similar to [importing][7] [glossarify-md][1]'s own JSON [exports][11]
*   [Importing][7] N-Triples/N-Quads requires the file name to end with `.nq`

*Example: [Import][7] RDF + [SKOS 🌎][8] from an N-Quads serialization:*

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

[2]: http://www.w3.org/2004/02/skos/core#prefLabel

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term "Terms are headings in a markdown file which has been configured to be a glossary file."

[4]: http://www.w3.org/2004/02/skos/core#altLabel

[5]: https://github.com/about-code/glossarify-md/blob/master/doc/term-attributes.md#aliases "Expects a comma-separated string or a list of strings which provide synonyms or alternative spellings for a term that should be linked with a term definition when found in text."

[6]: http://www.w3.org/2004/02/skos/core#definition

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https, when configured this way."

[8]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[9]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[10]: https://www.w3.org/standards/semanticweb/ontology "See Linked Data."

[11]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0 Exporting makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory."

[12]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#vocabulary "A collection of terms which is uniquely identifiable."
