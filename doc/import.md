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

### [Importing from CSV](#importing-from-csv)

**Since v7.0.0**

CSV is a textual serialization for tabular data and supported by most spreadsheed programmes. Columns in CSV are separated by a `delimiter`.

*Example: CSV formatted tabular data delimited by `;` and without a header row*

```csv
#123;IGNORED-COLUMN;My Term;Alternative Term;This Term stands for Foo
```

Without a header row embedded into the CSV data a `schema` mapping is required to tell glossarify-md where to find glossary columns (resp. `fields`):

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
  }
}]
```

*   Use `@id` for the ID column
*   Use [http://www.w3.org/2004/02/skos/core#prefLabel][1] for the term column
*   Use [http://www.w3.org/2004/02/skos/core#altLabel][2] for one or more alternative term columns (aliases)
*   Use [http://www.w3.org/2004/02/skos/core#definition][3] for the [term definition][4] column

A `schema` mapping can be omitted when the CSV file embeds these as header labels in the first row:

*Example: CSV with a header row*

```csv
@id;http://www.w3.org/2004/02/skos/core#prefLabel;http://www.w3.org/2004/02/skos/core#altLabel;http://www.w3.org/2004/02/skos/core#definition

#123;My Term;Alternative Term;This Term stands for Foo
```

### [Importing from JSON exported by glossarify-md](#importing-from-json-exported-by-glossarify-md)

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

### [Importing from JSON exported by other software](#importing-from-json-exported-by-other-software)

In contrast to [importing][5] from a JSON file which was exported by glossarify-md itself, importing from arbitrary data models and JSON serializations is likely to require mappings onto [SKOS 🌎][6] types. Have a look at glossarify-md's own JSON [export][7] format to see how it maps format-specific attribute and type names onto SKOS properties and concepts. See Interoperability with SKOS and [JSON-LD 🌎][8] for an in-depth example.

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

### [From RDF + SKOS](#from-rdf--skos)

**Since v6.0.0**

Glossary terms can also be imported from RDF serializations when the RDF triples refer to supported [SKOS 🌎][6] concepts and properties. Supported RDF serializations are **N-Triples, N-Quads or [JSON-LD 🌎][8]**.

*   [Importing][5] N-Triples/N-Quads requires the file name to end with `.nq`
*   [Importing][5] from [JSON-LD 🌎][8] requires the file name to end with `.jsonld`
    *   For an example on how to [import][5] from [JSON-LD 🌎][8] have a look at glossarify-md's own JSON [export][7] format to see how it maps format-specific attribute and type names onto [SKOS 🌎][6] properties and concepts. See also Interoperability with SKOS and JSON-LD for an in-depth example.

*Example: [Import][5] RDF + [SKOS 🌎][6] from an N-Quads serialization:*

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

[1]: http://www.w3.org/2004/02/skos/core#prefLabel

[2]: http://www.w3.org/2004/02/skos/core#altLabel

[3]: http://www.w3.org/2004/02/skos/core#definition

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-definition "A term definition is, technically, the phrase of a heading in a Markdown file which was configured to be a glossary file."

[5]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https, when configured this way."

[6]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0 Exporting makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory."

[8]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."
