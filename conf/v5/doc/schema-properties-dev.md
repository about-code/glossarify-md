## dev Default Value

The default value is:

```json
{}
```

# dev Properties

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                |
| :-------------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [printInputAst](#printinputast)         | Multiple  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-dev-properties-printinputast.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/printInputAst")         |
| [printOutputAst](#printoutputast)       | Multiple  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-dev-properties-printoutputast.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/printOutputAst")       |
| [reportsFile](#reportsfile)             | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-dev-properties-reportsfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/reportsFile")             |
| [reproducablePaths](#reproducablepaths) | `boolean` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-dev-properties-reproducablepaths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/reproducablePaths") |
| [termsFile](#termsfile)                 | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-dev-properties-termsfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/termsFile")                 |
| [effectiveConfFile](#effectiveconffile) | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-dev-properties-effectiveconffile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/effectiveConfFile") |

## printInputAst

Print the AST of scanned markdown documents prior to linkification. May be a Regex to only print AST for particular document.

`printInputAst`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-dev-properties-printinputast.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/printInputAst")

## printOutputAst

Print the AST of scanned markdown documents after linkification. May be a Regex to only print AST for particular document.

`printOutputAst`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-dev-properties-printoutputast.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/printOutputAst")

## reportsFile

File where to write console report output. Enables testing the report output generated  by the 'writer' component.

`reportsFile`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-dev-properties-reportsfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/reportsFile")

## reproducablePaths

Write system-independent paths into 'termsFile' to produce reproducable output across environments.

`reproducablePaths`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-dev-properties-reproducablepaths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/reproducablePaths")

## termsFile

File where to write term book to. Enables testing the term extraction results of the 'terminator' component.

`termsFile`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-dev-properties-termsfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/termsFile")

## effectiveConfFile

File where to write the configuration that is applied effectively after merging config file, cli opts and schema defaults.

`effectiveConfFile`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-dev-properties-effectiveconffile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Development/properties/effectiveConfFile")
