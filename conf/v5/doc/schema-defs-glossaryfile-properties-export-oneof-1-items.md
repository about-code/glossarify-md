# items Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                        |
| :------------------ | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [context](#context) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfileexport-properties-context.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileExport/properties/context") |
| [file](#file)       | `string` | Required | cannot be null | [Configuration Schema](schema-defs-glossaryfileexport-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileExport/properties/file")       |

## context

File path or URL to a custom JSON-LD context document. JSON-LD contexts map terms from glossarify-md's export format onto terms of the well-known W3C SKOS vocabulary. If you want to import terms to another application supporting JSON-LD but not SKOS, then you can provide a custom JSON-LD context document with mappings of glossarify-md's terminology onto the one understood by the target application.

`context`

*   is optional

*   Type: `string`

## file

A JSON file name to write exported terms to. Recommended file extension is '.json' or '.jsonld'

`file`

*   is required

*   Type: `string`
