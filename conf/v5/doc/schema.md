# Configuration Schema Properties



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

Path or glob patterns of files to include for linking to glossaries.

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
  "mentions": "all",
  "headingDepths": [
    2,
    3,
    4,
    5,
    6
  ],
  "limitByAlternatives": 10
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

*   Type: merged type ([Details](schema-properties-unified.md))

### unified Default Value

The default value is:

```json
{}
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

## Definitions group generateFiles

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/generateFiles"}
```



### indexFile

Generate a file with a list of glossary terms and where they have been used.

`indexFile`

*   is optional

*   Type: `object` ([Details](schema-defs-generatefiles-properties-indexfile.md))

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
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/glossaryFile"}
```



### file

Name of the glossary file. Conventional default is *glossary.md*. You can use a glob pattern to enable cross-linking of headings across multiple files. Note that 'termHint' and 'title' will be ignored if 'file' is a glob pattern.

`file`

*   is optional

*   Type: `string`

### termHint

A symbol to append to a link to denote that the term refers to a glossary term.

`termHint`

*   is optional

*   Type: `string`

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

## Definitions group indexFile

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/indexFile"}
```



### file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is optional

*   Type: `string`

### class

The class is used to compile lists of content elements. Elements with a common class will be compiled into the same list.

`class`

*   is optional

*   Type: `string`

### title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

*   Type: `string`

## Definitions group indexing

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/indexing"}
```



### groupByHeadingDepth

Level of detail by which to group occurrences of terms or syntactic elements in generated files (Range \[min, max]: \[0, 6]). For example, use 0 to not group at all; 1 to group things at the level of document titles, etc. Configures the indexer. The option affects any files generated from the internal AST node index.

`groupByHeadingDepth`

*   is optional

*   Type: `integer`

#### groupByHeadingDepth Constraints

**maximum**: the value of this number must smaller than or equal to: `6`

**minimum**: the value of this number must greater than or equal to: `0`

### headingDepths

An array with items in a range of 1-6 denoting the depths of headings that should be indexed. Excluding some headings from indexing is mostly a performance optimization, only. You can just remove the option from your config or stick with defaults. Change defaults only if you are sure that you do not want to have cross-document links onto headings at a particular depth, no matter whether the link was created automatically or written manually.
The relation to 'linking.headingDepths' is that *this* is about "knowing the link targets" whereas the other is about "creating links" ...based on knowledge about link targets. Yet, indexing of headings is further required for existing (cross-)links like `[foo](#heading-id)` and resolving the path to where a heading with such id was declared, so for example `[foo](../document.md#heading-id)`.

`headingDepths`

*   is optional

*   Type: `integer[]`

## Definitions group i18n

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n"}
```



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
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/linking"}
```



### baseUrl

The base url to use when creating absolute links to glossary.

`baseUrl`

*   is optional

*   Type: `string`

#### baseUrl Constraints

**unknown format**: the value of this string must follow the format: `url`

### paths

Control how paths to linked documents will be constructed. Choosing "absolute" requires a "baseUrl" as well.

`paths`

*   is optional

*   Type: `string`

#### paths Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"relative"` |             |
| `"absolute"` |             |

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

### headingDepths

An array of numerical values each in a range of 1-6 denoting the depths of headings that should participate in term-based link creation ("linkification"). In case you have modified 'indexing.headingDepths', be aware that 'linking.headingDepths' makes only sense if it is a full subset of the items in 'indexing.headingDepths'.

`headingDepths`

*   is optional

*   Type: `integer[]`

### limitByAlternatives

This option can be used to limit the number of links, if there are multiple definitions of a term. When using a positive value, then the system creates links *no more than ...* alternative links. If the number is negative then the absolute amount indicates to *not link a term at all once there are at least ...* alternative definitions. For example:
1 linkifies the term in text and adds a link to 1 alternative definition (superscript),
0 only linkifies the term in text but adds 0 links to alternative definitions,
\-1 does not linkify a term in text once there is at least 1 alternative definition.
Negative values may also be helpful when using 'glossaries' option with a glob pattern and there are multiple documents that follow a certain template and thus repeatedly declare the same heading (= term).

`limitByAlternatives`

*   is optional

*   Type: `integer`

## Definitions group UnifiedExternalConfig

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/UnifiedExternalConfig"}
```



### rcPath

Path to an external *unified* configuration file as documented under <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>. See description of *unified* property why you may want such a configuration.

`rcPath`

*   is required

*   Type: `string`

## Definitions group unified

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/unified"}
```



### plugins

Object or array with names of *unified* and *remark* plug-ins and plug-in settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>
Note that this configuration is not to be considered part of glossarify-md's own configuration interface!
If you like to keep *unified* configuration separate use 'rcPath' to load a unified configuration from an external file.

`plugins`

*   is optional

*   Type: merged type ([Details](schema-defs-unified-properties-plugins.md))

### settings

Unified *processor* settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md> . glossarify-md uses the "remark" Markdown processor. To customize Markdown output style you can apply any *formatting options* documented at <https://github.com/syntax-tree/mdast-util-to-markdown#formatting-options> which is the module used by 'remark-stringify' to serialize (compile) the Markdown Abstract Syntax Tree that was created from Markdown text input back into Markdown text output.

`settings`

*   is optional

*   Type: `object` ([Details](schema-defs-unified-properties-settings.md))

## Definitions group dev

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/dev"}
```



### printInputAst

Print the AST of scanned markdown documents prior to linkification. May be a Regex to only print AST for particular document.

`printInputAst`

*   is optional

*   Type: any of the folllowing: `boolean` or `string` ([Details](schema-defs-dev-properties-printinputast.md))

### printOutputAst

Print the AST of scanned markdown documents after linkification. May be a Regex to only print AST for particular document.

`printOutputAst`

*   is optional

*   Type: any of the folllowing: `boolean` or `string` ([Details](schema-defs-dev-properties-printoutputast.md))

### reportsFile

File where to write console report output. Enables testing the report output generated  by the 'writer' component.

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

### effectiveConfFile

File where to write the configuration that is applied effectively after merging config file, cli opts and schema defaults.

`effectiveConfFile`

*   is optional

*   Type: `string`
