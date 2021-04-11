## generateFiles Default Value

The default value is:

```json
{
  "listOf": []
}
```

# generateFiles Properties



## indexFile

Generate a file with a list of glossary terms and where they have been used.

`indexFile`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-indexfile.md))

## indexFiles

Similar to 'indexFile' but allows you to split terms from multiple glossaries into distinct book indexes. Useful if you have multiple 'glossaries' or when you're using the 'glossaries' option with a file glob. In the latter case it helps you to restrict which terms should become part of the book index.

`indexFiles`

*   is optional

*   Type: `object[]` ([Details](schema-defs-generatefiles-properties-indexfiles-items.md))

## listOf

Generate an arbitrary list of links into your documents. For example, to generate a List of code samples configure a class 'listing' and add anchors `<a class='listing' title='My Sample 1' id='sample-1'/>` before your sample code blocks.

`listOf`

*   is optional

*   Type: `object[]` ([Details](schema-defs-generatefiles-properties-listof-items.md))

## listOfFigures

Generate a file with a list of figures and where they can be found.

`listOfFigures`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-listoffigures.md))

## listOfTables

Generate a file with a list of tables and where they can be found.

`listOfTables`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-listoftables.md))
