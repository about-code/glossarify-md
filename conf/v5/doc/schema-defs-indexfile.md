# indexFile Properties

| Property        | Type     | Required | Nullable       | Defined by                                                                                                                                                                                  |
| :-------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [file](#file)   | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/indexFile/properties/file")   |
| [class](#class) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-class.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/indexFile/properties/class") |
| [title](#title) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-title.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/indexFile/properties/title") |

## file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is optional

*   Type: `string`

## class

The class is used to compile lists of content elements. Elements with a common class will be compiled into the same list.

`class`

*   is optional

*   Type: `string`

## title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

*   Type: `string`
