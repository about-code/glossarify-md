# Configuration Schema Properties

| Property                                  | Type      | Required | Nullable       | Defined by                                                                                                                                                                             |
| :---------------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [baseDir](#basedir)                       | `string`  | Optional | cannot be null | [Configuration Schema](schema-properties-basedir.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/baseDir")                       |
| [excludeFiles](#excludefiles)             | `array`   | Optional | cannot be null | [Configuration Schema](schema-properties-excludefiles.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/excludeFiles")             |
| [force](#force)                           | `boolean` | Optional | cannot be null | [Configuration Schema](schema-properties-force.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/force")                           |
| [generateFiles](#generatefiles)           | `object`  | Optional | cannot be null | [Configuration Schema](schema-properties-generatefiles.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/generateFiles")           |
| [glossaries](#glossaries)                 | `array`   | Optional | cannot be null | [Configuration Schema](schema-properties-glossaries.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/glossaries")                 |
| [ignoreCase](#ignorecase)                 | `boolean` | Optional | cannot be null | [Configuration Schema](schema-properties-ignorecase.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/ignoreCase")                 |
| [includeFiles](#includefiles)             | `array`   | Optional | cannot be null | [Configuration Schema](schema-properties-includefiles.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/includeFiles")             |
| [indexing](#indexing)                     | `object`  | Optional | cannot be null | [Configuration Schema](schema-properties-indexing.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/indexing")                     |
| [i18n](#i18n)                             | `object`  | Optional | cannot be null | [Configuration Schema](schema-properties-i18n.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/i18n")                             |
| [keepRawFiles](#keeprawfiles)             | `array`   | Optional | cannot be null | [Configuration Schema](schema-properties-keeprawfiles.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/keepRawFiles")             |
| [linking](#linking)                       | `object`  | Optional | cannot be null | [Configuration Schema](schema-properties-linking.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/linking")                       |
| [outDir](#outdir)                         | `string`  | Optional | cannot be null | [Configuration Schema](schema-properties-outdir.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/outDir")                         |
| [outDirDropOld](#outdirdropold)           | `boolean` | Optional | cannot be null | [Configuration Schema](schema-properties-outdirdropold.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/outDirDropOld")           |
| [reportNotMentioned](#reportnotmentioned) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-properties-reportnotmentioned.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/reportNotMentioned") |
| [unified](#unified)                       | Merged    | Optional | cannot be null | [Configuration Schema](schema-properties-unified.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/unified")                       |
| [dev](#dev)                               | `object`  | Optional | cannot be null | [Configuration Schema](schema-properties-dev.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/properties/dev")                               |

## baseDir

Path to directory where to search for the glossary file and markdown files. All paths in a config file will be relative to 'baseDir' while 'baseDir' itself, when relative, must be relative to the location of the config file - or the current working directory when provided via command line.

`baseDir`

*   is optional

*   Type: `string`

### baseDir Default Value

The default value is:

```json
"./docs"
```

## excludeFiles

An array of files or file name patterns that should not be included in any processing.

`excludeFiles`

*   is optional

*   Type: `string[]`

### excludeFiles Default Value

The default value is:

```json
[
  "node_modules",
  ".git"
]
```

## force

Choose true, only if you know the consequences.

`force`

*   is optional

*   Type: `boolean`

## generateFiles

File generation options.

`generateFiles`

*   is optional

*   Type: `object` ([Details](schema-properties-generatefiles.md))

### generateFiles Default Value

The default value is:

```json
{
  "listOf": []
}
```

## glossaries

An array of glossaries. Allows for different kinds of glossaries and definitions.

`glossaries`

*   is optional

*   Type: `object[]` ([Details](schema-properties-glossaries-items.md))

### glossaries Default Value

The default value is:

```json
[
  {
    "file": "./glossary.md",
    "termHint": ""
  }
]
```

## ignoreCase

Find and link every occurrence of a term no matter how it is spelled.

`ignoreCase`

*   is optional

*   Type: `boolean`

## includeFiles

Path or glob patterns of files to include for linking to glossaries.

`includeFiles`

*   is optional

*   Type: `string[]`

### includeFiles Default Value

The default value is:

```json
[
  "."
]
```

## indexing

Options configuring the indexer.

`indexing`

*   is optional

*   Type: `object` ([Details](schema-properties-indexing.md))

### indexing Default Value

The default value is:

```json
{
  "groupByHeadingDepth": 6,
  "headingDepths": [
    1,
    2,
    3,
    4,
    5,
    6
  ]
}
```

## i18n

i18n and collation options. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>.

`i18n`

*   is optional

*   Type: `object` ([Details](schema-properties-i18n.md))

### i18n Default Value

The default value is:

```json
{
  "locale": "en"
}
```

## keepRawFiles

Glob patterns for (markdown) files to copy from 'baseDir' to 'outDir' but to ignore by the linker. Non-markdown files will be ignored anyways.

`keepRawFiles`

*   is optional

*   Type: `string[]`

### keepRawFiles Default Value

The default value is:

```json
[]
```

## linking

Options to control linkification behavior.

`linking`

*   is optional

*   Type: `object` ([Details](schema-properties-linking.md))

### linking Default Value

The default value is:

```json
{
  "baseUrl": "",
  "paths": "relative",
  "pathRewrites": {},
  "pathComponents": [
    "path",
    "file",
    "ext"
  ],
  "mentions": "all",
  "headingDepths": [
    2,
    3,
    4,
    5,
    6
  ],
  "headingIdAlgorithm": "github",
  "headingIdPandoc": false,
  "headingAsLink": true,
  "byReferenceDefinition": true,
  "limitByTermOrigin": [],
  "limitByAlternatives": 10,
  "sortAlternatives": {
    "by": "glossary-filename"
  }
}
```

## outDir

Path to directory where to write processed files to.

`outDir`

*   is optional

*   Type: `string`

### outDir Default Value

The default value is:

```json
"../docs-glossarified"
```

## outDirDropOld

If true, remove old 'outDir' before creating a new one. Otherwise just overwrite old files. Default: true

`outDirDropOld`

*   is optional

*   Type: `boolean`

### outDirDropOld Default Value

The default value is:

```json
true
```

## reportNotMentioned

Report on terms which exist in a glossary but have neither been mentioned directly nor with any of its aliases.

`reportNotMentioned`

*   is optional

*   Type: `boolean`

## unified

Extended *unified* and *remark* configuration as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>
You may want to provide such a configuration for loading *remark* plug-ins you've installed yourself. You likely require such plug-ins if your input files use third-party syntax which is not covered by the CommonMark specification. glossarify-md only supports CommonMark, GitHub Flavoured Markdown (GFM) and Footnotes by default. For additional remark plug-ins see <https://github.com/remarkjs/awesome-remark>
Note that this configuration is not to be considered part of glossarify-md's own configuration interface! glossarify-md can not be held responsible for issues arising from loading additional plug-ins.
If you like to keep *unified* configuration separate use e.g. '{ "unified": { "rcPath": "../unified.conf.json"}} to load a unified configuration from an external file.

`unified`

*   is optional

*   Type: `object` ([Details](schema-properties-unified.md))

### unified Default Value

The default value is:

```json
{}
```

### unified Examples

```json
{
  "rcPath": "./.remarkrc.json"
}
```

```json
{
  "settings": {
    "bullet": "*",
    "ruleRepetition": 3,
    "fences": true
  },
  "plugins": {
    "remark-frontmatter": {
      "type": "yaml",
      "marker": "-"
    }
  }
}
```

## dev



`dev`

*   is optional

*   Type: `object` ([Details](schema-properties-dev.md))

### dev Default Value

The default value is:

```json
{}
```

# Configuration Schema Definitions

## Definitions group csvDialect

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect"}
```

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [delimiter](#delimiter)   | `string` | Required | cannot be null | [Configuration Schema](schema-defs-csvdialect-properties-delimiter.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect/properties/delimiter")   |
| [quoteChar](#quotechar)   | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-csvdialect-properties-quotechar.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect/properties/quoteChar")   |
| [escapeChar](#escapechar) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-csvdialect-properties-escapechar.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvDialect/properties/escapeChar") |

### delimiter

A character sequence to use as the field separator.

`delimiter`

*   is required

*   Type: `string`

#### delimiter Default Value

The default value is:

```json
";"
```

### quoteChar

A one-character string for surrounding field values in CSV data (no matter whether being a numeric value or an alphanumeric value or something else). Uses the quote character " by default. A CSV field whose field value is text containing quotes is required to embed the whole text value between two `quoteChar` as well as escaping the quotes in the text data using `escapeChar`. For example a raw value of ;This is "quoted" text; is expected to be encoded in CSV as ;"This is ""quoted"" text"; where the outer quotes are `quoteChars` and the inner quotes each are preceeded by an `escapeChar` (which is a quote character by default, either).

`quoteChar`

*   is optional

*   Type: `string`

#### quoteChar Default Value

The default value is:

```json
"\""
```

### escapeChar

Specifies a one-character string to use as an escape character within a field value. Uses the quote " character as a default which requires encoding quotes in text data using two consecutive quotes (one being the escape character and one being the actual quote of the data). This is a very common encoding scheme. However, change this to an empty string to disable escaping, completely or use another character as needed.

`escapeChar`

*   is optional

*   Type: `string`

#### escapeChar Default Value

The default value is:

```json
"\""
```

## Definitions group csvTableSchema

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvTableSchema"}
```

| Property          | Type    | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :---------------- | :------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [fields](#fields) | `array` | Required | cannot be null | [Configuration Schema](schema-defs-csvtableschema-properties-fields.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvTableSchema/properties/fields") |

### fields



`fields`

*   is required

*   Type: `object[]` ([Details](schema-defs-csvtableschema-properties-fields-items.md))

#### fields Constraints

**minimum number of items**: the minimum number of items for this array is: `1`

## Definitions group csvTableSchemaField

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvTableSchemaField"}
```

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                    |
| :------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [name](#name) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-csvtableschemafield-properties-name.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvTableSchemaField/properties/name") |

### name

A name for this field.

`name`

*   is optional

*   Type: `string`

#### name Default Value

The default value is:

```json
"http://www.w3.org/2004/02/skos/core#"
```

## Definitions group csvTableSchemaFieldName

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/csvTableSchemaFieldName"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group generateFiles

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/generateFiles"}
```

| Property                        | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                          |
| :------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [indexFile](#indexfile)         | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-generatefiles-properties-indexfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/indexFile")         |
| [indexFiles](#indexfiles)       | `array`  | Optional | cannot be null | [Configuration Schema](schema-defs-generatefiles-properties-indexfiles.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/indexFiles")       |
| [listOf](#listof)               | `array`  | Optional | cannot be null | [Configuration Schema](schema-defs-generatefiles-properties-listof.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/listOf")               |
| [listOfFigures](#listoffigures) | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-generatefiles-properties-listoffigures.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/listOfFigures") |
| [listOfTables](#listoftables)   | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-generatefiles-properties-listoftables.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/generateFiles/properties/listOfTables")   |

### indexFile

Generate a file with a list of glossary terms and where they have been used.

`indexFile`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-indexfile.md))

### indexFiles

Similar to 'indexFile' but allows you to split terms from multiple glossaries into distinct book indexes. Useful if you have multiple 'glossaries' or when you're using the 'glossaries' option with a file glob. In the latter case it helps you to restrict which terms should become part of the book index.

`indexFiles`

*   is optional

*   Type: `object[]` ([Details](schema-defs-generatefiles-properties-indexfiles-items.md))

### listOf

Generate an arbitrary list of links into your documents. For example, to generate a List of code samples configure a class 'listing' and add anchors `<a class='listing' title='My Sample 1' id='sample-1'/>` before your sample code blocks.

`listOf`

*   is optional

*   Type: `object[]` ([Details](schema-defs-generatefiles-properties-listof-items.md))

### listOfFigures

Generate a file with a list of figures and where they can be found.

`listOfFigures`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-listoffigures.md))

### listOfTables

Generate a file with a list of tables and where they can be found.

`listOfTables`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-listoftables.md))

## Definitions group glossaryFile

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile"}
```

| Property              | Type      | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :-------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [export](#export)     | Merged    | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-export.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/export")     |
| [file](#file)         | `string`  | Required | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/file")         |
| [import](#import)     | `object`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-import.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/import")     |
| [linkUris](#linkuris) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-linkuris.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/linkUris") |
| [sort](#sort)         | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-sort.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/sort")         |
| [showUris](#showuris) | Merged    | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-showuris.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/showUris") |
| [termHint](#termhint) | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-termhint.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/termHint") |
| [uri](#uri)           | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-uri.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/uri")           |

### export

Export terms from the markdown file as a JSON glossary. Output will contain JSON-LD mappings onto <http://w3.org/skos> for interoperability with knowledge organization systems supporting SKOS.

`export`

*   is optional

*   Type: merged type ([Details](schema-defs-glossaryfile-properties-export.md))

*   since: 6.0.0

### file

Name of the glossary file. Conventional default is *glossary.md*. You can use a glob pattern to enable cross-linking of headings across multiple files. Note that 'termHint' and 'title' will be ignored if 'file' is a glob pattern.

`file`

*   is required

*   Type: `string`

### import

Import a JSON glossary (see 'export'). Generates a glossary markdown file from imported terms. Advanced: if the optional 'jsonld' library is installed glossarify-md will assume the JSON file to be a JSON-LD file. If it contains mappings of its custom attribute names onto well-known names from the W3C SKOS vocabulary then glossarify-md may understand the file even if it has a different structure than files exported by glossarify-md itself.

`import`

*   is optional

*   Type: `object` ([Details](schema-defs-glossaryfile-properties-import.md))

*   since: 6.0.0

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/import.md

### linkUris

Set this to true to hyperlink occurrences of a term to an 'authoritative' web glossary using a term's URI as lookup URL (default: false). May be used together with a glossary's 'uri' option. When 'linkUris' is 'true' glossarify-md uses the glossary markdown file as a source of link titles (tooltips) or for other internal processing, only, but won't generate links from documents to the markdown glossary, anymore, but from documents to an external web page.

`linkUris`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

### sort

If present, sort terms in output glossary. Default: None. See also i18n options.

`sort`

*   is optional

*   Type: `string`

#### sort Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"asc"`  |             |
| `"desc"` |             |

### showUris

Whether to render a term's URI in the glossary (currently for imported glossaries, only). May be a markdown snippet using a placeholder `${uri}` to control URI formatting.

`showUris`

*   is optional

*   Type: merged type ([Details](schema-defs-glossaryfile-properties-showuris.md))

*   since: 6.0.0

#### showUris Examples

```json
{
  "showUris": true
}
```

```json
{
  "showUris": "- Markdown Formatted: *${uri}*"
}
```

### termHint

A symbol to append to a link to denote that the term refers to a glossary term.

`termHint`

*   is optional

*   Type: `string`

### uri

A namespace or vocabulary identifier used as a prefix to construct URIs for glossary terms. Term URIs may be used to identify a concept within a Semantic Web or Linked Data Context or just to locate an external web page with a human readable definition. See also option `linking.baseUrl`.

`uri`

*   is optional

*   Type: `string`

*   since: 6.0.0

#### uri Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## Definitions group glossaryFileExport

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileExport"}
```

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                        |
| :------------------ | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [context](#context) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfileexport-properties-context.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileExport/properties/context") |
| [file](#file-1)     | `string` | Required | cannot be null | [Configuration Schema](schema-defs-glossaryfileexport-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileExport/properties/file")       |

### context

File path or URL to a custom JSON-LD context document. JSON-LD contexts map terms from glossarify-md's export format onto terms of the well-known W3C SKOS vocabulary. If you want to import terms to another application supporting JSON-LD but not SKOS, then you can provide a custom JSON-LD context document with mappings of glossarify-md's terminology onto the one understood by the target application.

`context`

*   is optional

*   Type: `string`

### file

A JSON file name to write exported terms to. Recommended file extension is '.json' or '.jsonld'

`file`

*   is required

*   Type: `string`

## Definitions group glossaryFileImport

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                        |
| :-------------------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [context](#context-1) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfileimport-properties-context.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/properties/context") |
| [file](#file-2)       | `string` | Required | cannot be null | [Configuration Schema](schema-defs-glossaryfileimport-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFileImport/properties/file")       |

### context

File path or URL to a custom JSON-LD context document (application/ld+json) mapping format terminology (attributes, type names) of a JSON data document ('application/json') onto well-known W3C SKOS terminology.

`context`

*   is optional

*   Type: `string`

### file

The file to import terms from. Supported file content types: 'application/json', 'application/ld+json', 'application/n-quads'.

`file`

*   is required

*   Type: `string`

## Definitions group indexFile

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile"}
```

| Property                        | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                  |
| :------------------------------ | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [file](#file-3)                 | `string`  | Required | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/file")                   |
| [glossary](#glossary)           | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-glossary.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/glossary")           |
| [hideDeepLinks](#hidedeeplinks) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-hidedeeplinks.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/hideDeepLinks") |
| [title](#title)                 | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-indexfile-properties-title.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexFile/properties/title")                 |

### file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is required

*   Type: `string`

### glossary

When you configured multiple glossaries, then this option can be used to generate an index file with terms of a particular glossary, only. Use with `generateFiles.indexFiles` (not `generateFiles.indexFile`). Since v5.1.0.

`glossary`

*   is optional

*   Type: `string`

### hideDeepLinks

When this is `false` (default) then term occurrences in sections deeper than `indexing.groupByHeadingDepth` will be represented as short numeric links attached to a parent heading at depth `indexing.groupByHeadingDepth`. With this option being `true` you can disable these "deep" section links. Note that index file generation also depends on the kind of headings being indexed *at all* (see `indexing.headingDepths`). Since v6.1.0.

`hideDeepLinks`

*   is optional

*   Type: `boolean`

### title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

*   Type: `string`

## Definitions group indexing

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexing"}
```

| Property                                    | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                            |
| :------------------------------------------ | :-------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [groupByHeadingDepth](#groupbyheadingdepth) | `integer` | Optional | cannot be null | [Configuration Schema](schema-defs-indexing-properties-groupbyheadingdepth.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexing/properties/groupByHeadingDepth") |
| [headingDepths](#headingdepths)             | `array`   | Optional | cannot be null | [Configuration Schema](schema-defs-indexing-properties-headingdepths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/indexing/properties/headingDepths")             |

### groupByHeadingDepth

Level of detail by which to group occurrences of terms or syntactic elements in generated files (Range \[min, max]: \[0, 6]). For example, use 0 to not group at all; 1 to group things at the level of document titles, etc. Configures the indexer. The option affects any files generated from the internal AST node index.

`groupByHeadingDepth`

*   is optional

*   Type: `integer`

#### groupByHeadingDepth Constraints

**maximum**: the value of this number must smaller than or equal to: `6`

**minimum**: the value of this number must greater than or equal to: `0`

### headingDepths

An array with items in a range of 1-6 denoting the depths of headings that should be indexed for cross-linking. Most of the time `linking.headingDepths` should be preferred to exclude certain headings from term-based auto linking. Excluding headings from indexing not only affects auto-linking but more such as path resolution for manual ID-based cross-links, generation of lists or book indexes and other features. Excluding headings from indexing is mostly a performance optimization applicable when headings at a particular level are never used or never required to be linkified.

`headingDepths`

*   is optional

*   Type: `integer[]`

## Definitions group listOfItemsFile

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/listOfItemsFile"}
```

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                  |
| :------------------ | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [class](#class)     | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-listofitemsfile-properties-class.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/listOfItemsFile/properties/class")     |
| [file](#file-4)     | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-listofitemsfile-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/listOfItemsFile/properties/file")       |
| [pattern](#pattern) | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-listofitemsfile-properties-pattern.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/listOfItemsFile/properties/pattern") |
| [title](#title-1)   | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-listofitemsfile-properties-title.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/listOfItemsFile/properties/title")     |

### class

The class is used to compile lists of content elements. Elements with a common class will be compiled into the same list.

`class`

*   is optional

*   Type: `string`

### file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is optional

*   Type: `string`

### pattern

A regular expression which when matching against text will generate an entry in the given list. The expression may contain a capture group which extracts a list item title. A match will result in an URL-addressable HTML node being added to the output.

`pattern`

*   is optional

*   Type: `string`

### title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

*   Type: `string`

## Definitions group i18n

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n"}
```

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                |
| :-------------------------------------- | :-------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [caseFirst](#casefirst)                 | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-casefirst.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/caseFirst")                 |
| [ignorePunctuation](#ignorepunctuation) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-ignorepunctuation.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/ignorePunctuation") |
| [locale](#locale)                       | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-locale.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/locale")                       |
| [localeMatcher](#localematcher)         | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-localematcher.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/localeMatcher")         |
| [numeric](#numeric)                     | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-numeric.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/numeric")                     |
| [sensitivity](#sensitivity)             | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-sensitivity.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/sensitivity")             |
| [usage](#usage)                         | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-usage.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/i18n/properties/usage")                         |

### caseFirst

Whether upper case or lower case should sort first. Default: 'false' (Use locale's default). See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`caseFirst`

*   is optional

*   Type: `string`

#### caseFirst Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value     | Explanation |
| :-------- | :---------- |
| `"upper"` |             |
| `"lower"` |             |
| `"false"` |             |

### ignorePunctuation

Whether punctuation should be ignored. Default: false. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`ignorePunctuation`

*   is optional

*   Type: `boolean`

### locale

The locale to use for operations such as sorting. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`locale`

*   is optional

*   Type: `string`

### localeMatcher

The locale matching algorithm to use. Default: 'best fit'. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`localeMatcher`

*   is optional

*   Type: `string`

#### localeMatcher Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"best fit"` |             |
| `"lookup"`   |             |

### numeric

Whether to use numeric collation. Default: false. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`numeric`

*   is optional

*   Type: `boolean`

### sensitivity

Which differences in the strings should lead to non-zero result values. Default: 'variant' for sorts, locale dependent for searches. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`sensitivity`

*   is optional

*   Type: `string`

#### sensitivity Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"base"`    |             |
| `"accent"`  |             |
| `"case"`    |             |
| `"variant"` |             |

### usage

Whether the comparison is for sorting or for searching for matching strings. Default: 'sort'. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`usage`

*   is optional

*   Type: `string`

#### usage Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"sort"`   |             |
| `"search"` |             |

## Definitions group linking

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking"}
```

| Property                                                                        | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                                              |
| :------------------------------------------------------------------------------ | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [baseUrl](#baseurl)                                                             | `string`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-baseurl.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/baseUrl")                                                             |
| [byReferenceDefinition](#byreferencedefinition)                                 | `boolean`     | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-byreferencedefinition.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/byReferenceDefinition")                                 |
| [headingAsLink](#headingaslink)                                                 | `boolean`     | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-headingaslink.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/headingAsLink")                                                 |
| [headingDepths](#headingdepths-1)                                               | `array`       | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-headingdepths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/headingDepths")                                                 |
| [headingIdAlgorithm](#headingidalgorithm)                                       | Not specified | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-headingidalgorithm.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/headingIdAlgorithm")                                       |
| [headingIdPandoc](#headingidpandoc)                                             | `boolean`     | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-headingidpandoc.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/headingIdPandoc")                                             |
| [limitByAlternatives](#limitbyalternatives)                                     | `integer`     | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-limitbyalternatives.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/limitByAlternatives")                                     |
| [limitByTermOrigin](#limitbytermorigin)                                         | `array`       | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-limitbytermorigin.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/limitByTermOrigin")                                         |
| [mentions](#mentions)                                                           | `string`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-mentions.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/mentions")                                                           |
| [paths](#paths)                                                                 | `string`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-paths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/paths")                                                                 |
| [pathComponents](#pathcomponents)                                               | `array`       | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-pathcomponents.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/pathComponents")                                               |
| [pathRewrites](#pathrewrites)                                                   | `object`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-pathrewrites.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/pathRewrites")                                                   |
| [sortAlternatives](#sortalternatives)                                           | Merged        | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-sortalternatives.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/sortAlternatives")                                           |
| [sortAlternatives.by.glossary-filename](#sortalternativesbyglossary-filename)   | `object`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-sortalternativesbyglossary-filename.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/sortAlternatives.by.glossary-filename")   |
| [sortAlternatives.by.glossary-ref-count](#sortalternativesbyglossary-ref-count) | `object`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-sortalternativesbyglossary-ref-count.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/sortAlternatives.by.glossary-ref-count") |

### baseUrl

The base URL to use for (web-)linking. Use `paths: "absolute"` to (cross-)link terms by their term URLs rather than by relative file paths. A term URL is a combination of `baseUrl` + `path,file,ext` + `#term-fragment` where `path,file,ext` can be customized using `linking.pathComponents`. Linked Data URIs: A term URL will be considered a term's (vocabulary) URI, too. However, if the term URL can not be guaranteed to be a *long lasting* identifier for the term's definition or doesn't match its predefined URI, then you might want to declare a dedicated URI per glossary. It will be used as an URI prefix to the glossary's terms (see also option `glossaries[i].uri`).

`baseUrl`

*   is optional

*   Type: `string`

#### baseUrl Constraints

**unknown format**: the value of this string must follow the format: `url`

### byReferenceDefinition

When 'true' replaces markdown inline links with numbered references to a link reference definition list at the bottom of a markdown file. See 'Link Reference Definitions' on <http://commonmark.org>.

`byReferenceDefinition`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

### headingAsLink

Whether to linkify headings. Some Markdown-to-HTML renderers may require this is to be true to generate navigable HTML (e.g. VuePress and GitHub's MD preview). You may be able to use 'false' when other reference mechanisms are in place, such as pandoc-style {#...} header attributes.

`headingAsLink`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

### headingDepths

An array of numerical values each in a range of 1-6 denoting the headings level that should participate in term-based auto linking. Note that indexing the given levels is a prerequisite (see `indexing.headingDepths`). So configuring `indexing.headingDepths: [1]` but `linking.headingDepths:[1,2]` would *not* linkify term headings at depth `2`. Instead with `indexing.headingDepths: [1,2,3]` *would*.

`headingDepths`

*   is optional

*   Type: `integer[]`

### headingIdAlgorithm

Algorithm to use for generating heading IDs. The "github" algorithm (default) produces easier to read IDs but only guarantees uniqueness per file. Use one of the cryptographic hash functions to have IDs be unique across all output files. Hash functions are likely to be required when concatenating output files with tools like pandoc ( <https://pandoc.org> ).

`headingIdAlgorithm`

*   is optional

*   Type: unknown

*   since: 6.0.0

#### headingIdAlgorithm Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"github"`   |             |
| `"md5"`      |             |
| `"md5-7"`    |             |
| `"sha256"`   |             |
| `"sha256-7"` |             |

### headingIdPandoc

When true appends pandoc-style {#...} heading identifiers where necessary. Note that independent from this setting input files may use pandoc-style heading identifiers for cross-linking by id.

`headingIdPandoc`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

### limitByAlternatives

This option can be used to deal with ambiguities and limit the number of links in case of multiple definitions for a term. For example, a value of
`5` makes the system link to *at most 5* additional definitions per term
. The value `0` links the term to a single definition but adds zero additional links indicating alternative definitions even if there are any. Since v7.1.0 we recommend not only but especially for value `0` to combine it with 'sortAlternatives'. This increases the likelihood that the one definition being linked is the one appropriate in the context of a term's usage.
A value of `-1` makes the system stop linking a term once there is at least 1 additional definition (stops linking ambiguous terms, completely)
`-5` makes the system stop linking a term once there are *at least 5* additional definitions

. Negative values may also be helpful when using option 'glossaries.file' with a glob pattern where the glob pattern matches many documents that share a common heading template. Then the repetitive use of the template causes ambiguity and leads to many alternative links being rendered. Use this option, for example, to limit their number.

`limitByAlternatives`

*   is optional

*   Type: `integer`

### limitByTermOrigin

This option can be used to deal with ambiguities when there are multiple glossaries with competing definitions for a term. It can restrict the applicable scope of a glossary based on the directory structure and glossary file locations of a book project. For example, `["parent", "sibling", "self"]` causes a term occurrence being linkified only in documents when the term has been defined in a glossary in a parent directory ("parent") or when it has been defined in a glossary next to the document file ("sibling") or within the glossary itself ("self"). The option allows for a hierarchy of glossaries e.g. a top-level glossary for common terms linked throughout a book and glossaries whose terms are being linked within a particular (sub-)directory/section branch, only. It may also provide a means of limiting auto-linking when the `glossaries` option is used with `file` wildcard patterns. It can also be a manual approach to improving linkification for ambiguous terms when the fuzzyness of 'linking.sortAlternatives' is impractical.  Defaults to `[]`. An array containing all enum values is equivalent to an empty array. It will make glossarify-md link each glossary term in every document.

`limitByTermOrigin`

*   is optional

*   Type: `string[]`

*   since: 6.1.0

### mentions

Control the link density and whether every occurrence of a term in your documents should be linked with its glossary definition or only the first occurrence within a particular range.

`mentions`

*   is optional

*   Type: `string`

#### mentions Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                  | Explanation |
| :--------------------- | :---------- |
| `"all"`                |             |
| `"first-in-paragraph"` |             |

### paths

Control how paths to linked documents will be constructed. When choosing "absolute" you may set a "baseUrl" as well. Without a base URL absolute file system paths will be generated.

`paths`

*   is optional

*   Type: `string`

#### paths Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"relative"` |             |
| `"absolute"` |             |
| `"none"`     |             |

### pathComponents

Adjust which path components should make it into auto-generated links. glossarify-md won't rewrite your own links.

`pathComponents`

*   is optional

*   Type: `string[]`

*   since: 6.0.0

#### pathComponents Constraints

**maximum number of items**: the maximum number of items for this array is: `3`

### pathRewrites

KEY-VALUE map where VALUE is a single search string or an array of strings or regular expressions (RegExp) and KEY is the replacement/rewrite string. Path rewriting won't change the output folder structure but is intended to be used when output folder structure changes after glossarify-md's own processing. Other glossarify-md options affect link paths and URLs and need to be considered in rewrite rules. Be aware that *URLs* can only be rewritten when the URL is based on 'baseUrl'. If you need path rewriting because the published directory layout differs from 'outDir' then you may find rewriting absolute paths ('paths: absolute') or URLs based on 'baseUrl' easier than than rewriting relative paths. Relative paths can be harder to get right and thus are more likely to result in dead links.

`pathRewrites`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-pathrewrites.md))

*   since: 6.1.0

### sortAlternatives

When there are multiple glossaries a term could have multiple definitions (ambiguity). This option lets you choose from different algorithms for sorting and priortizing glossary definitions. The primary definition will be considered the first definition in the sorted list of definitions. It will be the one used to link the phrase of an ambiguous term occurrence in the text. Other definitions become numerical shortlinks to supplementary definitions ordered according to their priority. Whether supplementary definitions are being rendered at all depends on option 'limitByAlternatives'.

`sortAlternatives`

*   is optional

*   Type: merged type ([Details](schema-defs-linking-properties-sortalternatives.md))

*   since: 7.1.0

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/ambiguities.md

#### sortAlternatives Default Value

The default value is:

```json
{
  "by": "glossary-filename"
}
```

#### sortAlternatives Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-ref-count",
    "perSectionDepth": 2
  }
}
```

### sortAlternatives.by.glossary-filename

Sorting alternative definitions by glossary file name sorts links to those glossary definitions created for term occurrences by comparing the file names of the glossaries hosting the to-be-linked term definitions. The sort algorithm assumes that there is only a single definition for a term in a single glossary file.

`sortAlternatives.by.glossary-filename`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-sortalternativesbyglossary-filename.md))

#### sortAlternatives.by.glossary-filename Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-filename"
  }
}
```

### sortAlternatives.by.glossary-ref-count

Sorting alternative definitions by glossary reference count sorts links to those glossary definitions by comparing the popularity of glossaries hosting the to-be-linked term definitions. It assumes a glossary to be more popular when its terms have occured (referenced, cited) more often in a section. In particular it assumes the most popular glossary in a section to provide the likely most appropriate definition when there competing definitions.

`sortAlternatives.by.glossary-ref-count`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-sortalternativesbyglossary-ref-count.md))

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/ambiguities.md

#### sortAlternatives.by.glossary-ref-count Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-ref-count",
    "perSectionDepth": 2
  }
}
```

## Definitions group unified

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                                    |
| :-------------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [rcPath](#rcpath)     | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-unified-properties-rcpath.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified/properties/rcPath")     |
| [plugins](#plugins)   | Merged   | Optional | cannot be null | [Configuration Schema](schema-defs-unified-properties-plugins.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified/properties/plugins")   |
| [settings](#settings) | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-unified-properties-settings.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified/properties/settings") |

### rcPath

Path to an external *unified* configuration file as documented under <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>. See description of *unified* property why you may want such a configuration.

`rcPath`

*   is optional

*   Type: `string`

*   more: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md#plugins

### plugins

Object or array with names of *unified* and *remark* plug-ins and plug-in settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>
Note that this configuration is not to be considered part of glossarify-md's own configuration interface!
If you like to keep *unified* configuration separate use 'rcPath' to load a unified configuration from an external file.

`plugins`

*   is optional

*   Type: merged type ([Details](schema-defs-unified-properties-plugins.md))

*   more: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md#plugins

### settings

Unified *processor* settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md> . glossarify-md uses the "remark" Markdown processor. To customize Markdown output style you can apply any *formatting options* documented at <https://github.com/syntax-tree/mdast-util-to-markdown#formatting-options> which is the module used by 'remark-stringify' to serialize (compile) the Markdown Abstract Syntax Tree that was created from Markdown text input back into Markdown text output.

`settings`

*   is optional

*   Type: `object` ([Details](schema-defs-unified-properties-settings.md))

## Definitions group dev

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev"}
```

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :-------------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [effectiveConfFile](#effectiveconffile) | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-dev-properties-effectiveconffile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev/properties/effectiveConfFile") |
| [printInputAst](#printinputast)         | Multiple  | Optional | cannot be null | [Configuration Schema](schema-defs-dev-properties-printinputast.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev/properties/printInputAst")         |
| [printOutputAst](#printoutputast)       | Multiple  | Optional | cannot be null | [Configuration Schema](schema-defs-dev-properties-printoutputast.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev/properties/printOutputAst")       |
| [reportsFile](#reportsfile)             | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-dev-properties-reportsfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev/properties/reportsFile")             |
| [reproducablePaths](#reproducablepaths) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-dev-properties-reproducablepaths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev/properties/reproducablePaths") |
| [termsFile](#termsfile)                 | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-dev-properties-termsfile.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/dev/properties/termsFile")                 |

### effectiveConfFile

File where to write the configuration that is applied effectively after merging config file, cli opts and schema defaults.

`effectiveConfFile`

*   is optional

*   Type: `string`

### printInputAst

Print the AST of scanned markdown documents prior to linkification. May be a Regex to only print AST for particular document.

`printInputAst`

*   is optional

*   Type: any of the following: `boolean` or `string` ([Details](schema-defs-dev-properties-printinputast.md))

### printOutputAst

Print the AST of scanned markdown documents after linkification. May be a Regex to only print AST for particular document.

`printOutputAst`

*   is optional

*   Type: any of the following: `boolean` or `string` ([Details](schema-defs-dev-properties-printoutputast.md))

### reportsFile

File where to write console report output. Enables testing the report output generated by the 'writer' component.

`reportsFile`

*   is optional

*   Type: `string`

### reproducablePaths

Write system-independent paths into 'termsFile' to produce reproducable output across environments.

`reproducablePaths`

*   is optional

*   Type: `boolean`

### termsFile

File where to write term book to. Enables testing the term extraction results of the 'terminator' component.

`termsFile`

*   is optional

*   Type: `string`
