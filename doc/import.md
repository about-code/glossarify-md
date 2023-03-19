# [Importing Terms](#importing-terms)

<!--
aliases: Import, importing, imports
-->

[strip-markdown]: https://npmjs.com/package/strip-markdown

> ⚠ **Important:** glossarify-md is able to import terms and definitions from a remote location using `https`. It will try to remove any Markdown and HTML from imported data using [strip-markdown][strip-markdown]. Nevertheless, as a rule of thumb, **never import from untrusted sources**.
>
> <details>
> Loading <strong>files from a remote location could enable a remote entity to embed malicious code</strong>, execute such code in the runtime context of glossarify-md or make glossarify-md embed it into <em>your</em> output files. <strong>Consider downloading files first and after review import them statically from within your project.</strong>

</details>

***

### [From CSV](#from-csv)

**Since v6.4.0**

CSV is a textual serialization for tabular data and supported by most spreadsheed programmes. Columns in CSV are separated by a `delimiter`.

*Example: CSV formatted tabular data delimited by `;` and without a header row*

```csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
```

Without a header row embedded into the CSV data a `schema` mapping is required to tell [glossarify-md][1] where to find [glossary][2] columns (resp. `fields`):

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
*   Use [http://www.w3.org/2004/02/skos/core#prefLabel][3] for the [term][4] column
*   Use [http://www.w3.org/2004/02/skos/core#altLabel][5] for one or more alternative [term][4] columns ([aliases][6])
*   Use [http://www.w3.org/2004/02/skos/core#definition][7] for the [term][4] definition column

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

[Importing][8] from arbitrary data models and JSON serializations is likely to require mappings onto [SKOS 🌎][9] types and attributes. See Interoperability with SKOS and [JSON-LD 🌎][10] for an in-depth example.

### [From RDF + SKOS](#from-rdf--skos)

**Since v6.0.0**

If you have an [SKOS 🌎][9] description of a [glossary][2] or taxonomy stored in some RDF [linked data 🌎][11] store then you might find linked data tooling that is able to [export][12]/convert/serialize your linked data [vocabulary][13] to **N-Triples, N-Quads or [JSON-LD 🌎][10]**.

*   [Importing][8] from [JSON-LD 🌎][10] should work similar to importing [glossarify-md][1]'s own JSON [exports][12]
*   [Importing][8] N-Triples/N-Quads requires the file name to end with `.nq`

*Example: [Import][8] RDF + [SKOS 🌎][9] from an N-Quads serialization:*

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

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#glossary "This is a glossary of terms helpful when working with glossarify-md or reading its docs."

[3]: http://www.w3.org/2004/02/skos/core#prefLabel

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term "Terms are headings in a markdown file which has been configured to be a glossary file."

[5]: http://www.w3.org/2004/02/skos/core#altLabel

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/term-attributes.md#aliases "Expects a comma-separated string or a list of strings which provide synonyms or alternative spellings for a term that should be linked with a term definition when found in text."

[7]: http://www.w3.org/2004/02/skos/core#definition

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https."

[9]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[10]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[11]: https://www.w3.org/standards/semanticweb/ontology "See Linked Data."

[12]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0"

[13]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#vocabulary "A collection of terms which is uniquely identifiable."
