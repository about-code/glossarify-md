## generateFiles Default Value

The default value is:

```json
{
  "listOf": []
}
```

# generateFiles Properties

| Property                        | Type     | Required | Nullable       | Defined by                                                                                                                                                                                            |
| :------------------------------ | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [indexFile](#indexfile)         | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/indexFile")                    |
| [listOf](#listof)               | `array`  | Optional | cannot be null | [Configuration Schema](schema-defs-generatefiles-properties-listof.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/listOf") |
| [listOfFigures](#listoffigures) | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/listOfFigures")                |
| [listOfTables](#listoftables)   | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/listOfTables")                 |

## indexFile

Generate a file with a list of glossary terms and where they have been used.

`indexFile`

*   is optional

*   Type: `object` ([Details](schema-defs-indexfile.md))

## listOf

Generate an arbitrary list of links into your documents. For example, to generate a List of code samples configure a class 'listing' and add anchors `<a class='listing' title='My Sample 1' id='sample-1'/>` before your sample code blocks.

`listOf`

*   is optional

*   Type: `object[]` ([Details](schema-defs-indexfile.md))

## listOfFigures

Generate a file with a list of figures and where they can be found.

`listOfFigures`

*   is optional

*   Type: `object` ([Details](schema-defs-indexfile.md))

## listOfTables

Generate a file with a list of tables and where they can be found.

`listOfTables`

*   is optional

*   Type: `object` ([Details](schema-defs-indexfile.md))
