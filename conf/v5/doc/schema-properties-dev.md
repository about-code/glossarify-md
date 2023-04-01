## dev Default Value

The default value is:

```json
{}
```

# dev Properties



## printInputAst

Print the AST of scanned markdown documents prior to linkification. May be a Regex to only print AST for particular document.

`printInputAst`

*   is optional

*   Type: any of the following: `boolean` or `string` ([Details](schema-defs-dev-properties-printinputast.md))

## printOutputAst

Print the AST of scanned markdown documents after linkification. May be a Regex to only print AST for particular document.

`printOutputAst`

*   is optional

*   Type: any of the following: `boolean` or `string` ([Details](schema-defs-dev-properties-printoutputast.md))

## reportsFile

File where to write console report output. Enables testing the report output generated  by the 'writer' component.

`reportsFile`

*   is optional

*   Type: `string`

## reproducablePaths

Write system-independent paths into 'termsFile' to produce reproducable output across environments.

`reproducablePaths`

*   is optional

*   Type: `boolean`

## termsFile

File where to write term book to. Enables testing the term extraction results of the 'terminator' component.

`termsFile`

*   is optional

*   Type: `string`

## effectiveConfFile

File where to write the configuration that is applied effectively after merging config file, cli opts and schema defaults.

`effectiveConfFile`

*   is optional

*   Type: `string`
