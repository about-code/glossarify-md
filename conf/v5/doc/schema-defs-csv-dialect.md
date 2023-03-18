## dialect Default Value

The default value is:

```json
{
  "delimiter": ";",
  "doubleQuote": true
}
```

# dialect Properties



## delimiter

A character sequence to use as the field separator.

`delimiter`

*   is required

*   Type: `string` ([Delimiter](schema-defs-csv-dialect-properties-delimiter.md))

### delimiter Default Value

The default value is:

```json
";"
```

## doubleQuote

Specifies the handling of quotes inside fields. If Double Quote is set to true, two consecutive quotes must be interpreted as one.

`doubleQuote`

*   is required

*   Type: `boolean` ([Double Quote](schema-defs-csv-dialect-properties-double-quote.md))

### doubleQuote Default Value

The default value is:

```json
true
```
