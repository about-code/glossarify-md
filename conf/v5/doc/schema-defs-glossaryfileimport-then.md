# then Properties



## title



`title`

*   is optional

*   Type: `string`

### title Default Value

The default value is:

```json
"Glossary"
```

## dialect

A CSV dialect descriptor. Similar to dialect in a <https://frictionlessdata.io> tabular data resource schema.

`dialect`

*   is optional

*   Type: `object` ([CSV Dialect](schema-defs-csv-dialect.md))

### dialect Default Value

The default value is:

```json
{
  "delimiter": ";",
  "doubleQuote": true
}
```

## schema

A mapping of CSV table fields onto SKOS terms, e.g.
"fields": \[
{ "rdfType": "<http://www.w3.org/2004/02/skos/core#Concept> "},
{ "rdfType": "http\://www\.w3.org/2004/02/skos/core#prefLabel "}
]. Aims to be compatible with <https://frictionlessdata.io> Tabular Data Resource schema.

`schema`

*   is optional

*   Type: `object` ([Table Schema](schema-defs-table-schema.md))