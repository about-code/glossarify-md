# Glossaries Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                    |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [file](#file)         | `string` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-glossaries-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Glossaries/properties/file")         |
| [termHint](#termhint) | `string` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-glossaries-properties-termhint.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Glossaries/properties/termHint") |
| [sort](#sort)         | `string` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-glossaries-properties-sort.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Glossaries/properties/sort")         |

## file

Name of the glossary file. Conventional default is 'glossary.md'. You can use a glob pattern to enable cross-linking of headings across multiple files. Note that 'termHint' and 'title' will be ignored if 'file' is a glob pattern.

`file`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-glossaries-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Glossaries/properties/file")

## termHint

A symbol to append to a link to denote that the term refers to a glossary term.

`termHint`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-glossaries-properties-termhint.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Glossaries/properties/termHint")

## sort

If present, sort terms in output glossary. Default: None. See also i18n options.

`sort`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-glossaries-properties-sort.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Glossaries/properties/sort")

### sort Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"asc"`  |             |
| `"desc"` |             |
