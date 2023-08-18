# indexFile Properties

| Property                        | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                  |
| :------------------------------ | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [file](#file)                   | `string`  | Required | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/file")                   |
| [glossary](#glossary)           | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-glossary.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/glossary")           |
| [hideDeepLinks](#hidedeeplinks) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-hidedeeplinks.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/hideDeepLinks") |
| [title](#title)                 | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-title.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/title")                 |

## file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is required

*   Type: `string`

## glossary

When you configured multiple glossaries, then this option can be used to generate an index file with terms of a particular glossary, only. Use with `generateFiles.indexFiles` (not `generateFiles.indexFile`). Since v5.1.0.

`glossary`

*   is optional

*   Type: `string`

## hideDeepLinks

When this is `false` (default) then term occurrences in sections deeper than `indexing.groupByHeadingDepth` will be represented as short numeric links attached to a parent heading at depth `indexing.groupByHeadingDepth`. With this option being `true` you can disable these "deep" section links. Note that index file generation also depends on the kind of headings being indexed *at all* (see `indexing.headingDepths`). Since v6.1.0.

`hideDeepLinks`

*   is optional

*   Type: `boolean`

## title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

*   Type: `string`
