# then Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                    |
| :------------------ | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [dialect](#dialect) | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-csvdialect.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/then/properties/dialect")                                   |
| [schema](#schema)   | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-csvtableschema.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/then/properties/schema")                                |
| [title](#title)     | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfileimport-csv-import-properties-title.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/then/properties/title") |

## dialect

A CSV dialect descriptor. Similar to dialect in a <https://frictionlessdata.io> tabular data resource schema.

`dialect`

*   is optional

*   Type: `object` ([Details](schema-defs-csvdialect.md))

### dialect Default Value

The default value is:

```json
{
  "delimiter": ";"
}
```

## schema

A mapping of CSV table fields onto SKOS terms, e.g.
"fields": \[
{ "rdfType": "<http://www.w3.org/2004/02/skos/core#Concept> "},
{ "rdfType": "<http://www.w3.org/2004/02/skos/core#prefLabel> "}
]. Aims to be compatible with <https://frictionlessdata.io> Tabular Data Resource schema.

`schema`

*   is optional

*   Type: `object` ([Details](schema-defs-csvtableschema.md))

## title



`title`

*   is optional

*   Type: `string`

### title Default Value

The default value is:

```json
"Glossary"
```
