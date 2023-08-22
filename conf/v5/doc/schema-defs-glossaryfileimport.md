# glossaryFileImport Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                        |
| :------------------ | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [context](#context) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfileimport-properties-context.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/properties/context") |
| [file](#file)       | `string` | Required | cannot be null | [Configuration Schema](schema-defs-glossaryfileimport-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/properties/file")       |

## context

File path or URL to a custom JSON-LD context document (application/ld+json) mapping format terminology (attributes, type names) of a JSON data document ('application/json') onto well-known W3C SKOS terminology.

`context`

*   is optional

*   Type: `string`

## file

The file to import terms from. Supported file content types: 'application/json', 'application/ld+json', 'application/n-quads'.

`file`

*   is required

*   Type: `string`
