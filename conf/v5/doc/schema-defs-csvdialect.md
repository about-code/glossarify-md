# csvDialect Properties

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [delimiter](#delimiter)   | `string` | Required | cannot be null | [Configuration Schema](schema-defs-csvdialect-properties-delimiter.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect/properties/delimiter")   |
| [quoteChar](#quotechar)   | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-csvdialect-properties-quotechar.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect/properties/quoteChar")   |
| [escapeChar](#escapechar) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-csvdialect-properties-escapechar.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect/properties/escapeChar") |

## delimiter

A character sequence to use as the field separator.

`delimiter`

*   is required

*   Type: `string`

### delimiter Default Value

The default value is:

```json
";"
```

## quoteChar

A one-character string for surrounding field values in CSV data (no matter whether being a numeric value or an alphanumeric value or something else). Uses the quote character " by default. A CSV field whose field value is text containing quotes is required to embed the whole text value between two `quoteChar` as well as escaping the quotes in the text data using `escapeChar`. For example a raw value of ;This is "quoted" text; is expected to be encoded in CSV as ;"This is ""quoted"" text"; where the outer quotes are `quoteChars` and the inner quotes each are preceeded by an `escapeChar` (which is a quote character by default, either).

`quoteChar`

*   is optional

*   Type: `string`

### quoteChar Default Value

The default value is:

```json
"\""
```

## escapeChar

Specifies a one-character string to use as an escape character within a field value. Uses the quote " character as a default which requires encoding quotes in text data using two consecutive quotes (one being the escape character and one being the actual quote of the data). This is a very common encoding scheme. However, change this to an empty string to disable escaping, completely or use another character as needed.

`escapeChar`

*   is optional

*   Type: `string`

### escapeChar Default Value

The default value is:

```json
"\""
```
