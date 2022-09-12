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

*   Type: `object` ([Details](schema-properties-unified.md))

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
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/generateFiles"}
```



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
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/glossaryFile"}
```



### export

Export terms from the markdown file as a JSON glossary. Output will contain JSON-LD mappings onto <http://w3.org/skos> for interoperability with knowledge organization systems supporting SKOS.

`export`

*   is optional

*   Type: merged type ([Details](schema-defs-glossaryfile-properties-export.md))

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

### linkUris

Set this to true to hyperlink occurrences of a term to an 'authoritative' web glossary using a term's URI as lookup URL (default: false). May be used together with a glossary's 'uri' option. When 'linkUris' is 'true' glossarify-md uses the glossary markdown file as a source of link titles (tooltips) or for other internal processing, only, but won't generate links from documents to the markdown glossary, anymore, but from documents to an external web page.

`linkUris`

*   is optional

*   Type: `boolean`

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

#### uri Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## Definitions group glossaryFileExport

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/glossaryFileExport"}
```



### file

A JSON file name to write exported terms to. Recommended file extension is '.json' or '.jsonld'

`file`

*   is required

*   Type: `string`

### context

File path or URL to a custom JSON-LD context document. JSON-LD contexts map terms from glossarify-md's export format onto terms of the well-known W3C SKOS vocabulary. If you want to import terms to another application supporting JSON-LD but not SKOS, then you can provide a custom JSON-LD context document with mappings of glossarify-md's terminology onto the one understood by the target application.

`context`

*   is optional

*   Type: `string`

## Definitions group glossaryFileImport

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/glossaryFileImport"}
```



### file

The JSON file to import terms from.

`file`

*   is required

*   Type: `string`

### context

File path or URL to a custom JSON-LD context document. Expected to map attributes and type names of a custom import document format onto terms of the well-known W3C SKOS vocabulary.

`context`

*   is optional

*   Type: `string`

## Definitions group indexFile

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/indexFile"}
```



### file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is required

*   Type: `string`

### title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

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

## Definitions group indexing

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/indexing"}
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

An array with items in a range of 1-6 denoting the depths of headings that should be indexed for cross-linking. Excluding headings from indexing is mostly a performance optimization, applicable when only headings at a particular depth should participate in id-based cross-linking or term-based auto linking. Note that it is possible to keep indexing all headings to support manually written id-based cross-links for all headings but restricting auto-linking to a subset of headings at a particular depth using `linking.headingDepths` (see `linking` options).

`headingDepths`

*   is optional

*   Type: `integer[]`

## Definitions group listOfItemsFile

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/listOfItemsFile"}
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

### pattern

A regular expression which when matching against text will generate an entry in the given list. The expression may contain a capture group which extracts a list item title. A match will result in an URL-addressable HTML node being added to the output.

`pattern`

*   is optional

*   Type: `string`

## Definitions group i18n

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/i18n"}
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
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/linking"}
```



### baseUrl

The base URL to use for (web-)linking. Use `paths: "absolute"` to (cross-)link terms by their term URLs rather than by relative file paths. A term URL is a combination of `baseUrl` + `path,file,ext` + `#term-fragment` where `path,file,ext` can be customized using `linking.pathComponents`. Linked Data URIs: A term URL will be considered a term's (vocabulary) URI, too. However, if the term URL can not be guaranteed to be a *long lasting* identifier for the term's definition or doesn't match its predefined URI, then you might want to declare a dedicated URI per glossary. It will be used as an URI prefix to the glossary's terms (see also option `glossaries[i].uri`).

`baseUrl`

*   is optional

*   Type: `string`

#### baseUrl Constraints

**unknown format**: the value of this string must follow the format: `url`

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

#### pathComponents Constraints

**maximum number of items**: the maximum number of items for this array is: `3`

### pathRewrites

KEY-VALUE map where VALUE is a single search string or an array of strings or regular expressions (RegExp) and KEY is the replacement/rewrite string. Path rewriting won't change the output folder structure but is intended to be used when output folder structure changes after glossarify-md's own processing. Other glossarify-md options affect link paths and URLs and need to be considered in rewrite rules. Be aware that *URLs* can only be rewritten when the URL is based on 'baseUrl'. If you need path rewriting because the published directory layout differs from 'outDir' then you may find rewriting absolute paths ('paths: absolute') or URLs based on 'baseUrl' easier than than rewriting relative paths. Relative paths can be harder to get right and thus are more likely to result in dead links.

`pathRewrites`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-pathrewrites.md))

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

An array of numerical values each in a range of 1-6 denoting the depths of headings that should participate in term-based link creation ("linkification"). Note the dependency on `indexing.headingDepths`: The latter controls which headings to index as "terms" *at all* so only indexed headings can be linkified at all. As you likely guess this means that configuring `indexing.headingDepths: [1]` but `linking.headingDepths:[1,2]` would *not* linkify term headings at depth `2` because they haven't been indexed, before. Instead with `indexing.headingDepths: [1,2,3]` *they would* because then headings at depth 1 to 3 would be indexed which includes headings at depth `2`, of course. Or long story short: `linking.headingDepths` is expected to be a fully enclosed subset of `indexing.headingDepths`.

`headingDepths`

*   is optional

*   Type: `integer[]`

### headingIdAlgorithm

Algorithm to use for generating heading IDs. The "github" algorithm (default) produces easier to read IDs but only guarantees uniqueness per file. Use one of the cryptographic hash functions to have IDs be unique across all output files. Hash functions are likely to be required when concatenating output files with tools like pandoc ( <https://pandoc.org> ).

`headingIdAlgorithm`

*   is optional

*   Type: unknown

#### headingIdAlgorithm Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"github"`   |             |
| `"md5"`      |             |
| `"md5-7"`    |             |
| `"sha256"`   |             |
| `"sha256-7"` |             |

### headingAsLink

Whether to linkify headings. Some Markdown-to-HTML renderers may require this is to be true to generate navigable HTML (e.g. VuePress and GitHub's MD preview). You may be able to use 'false' when other reference mechanisms are in place, such as pandoc-style {#...} header attributes.

`headingAsLink`

*   is optional

*   Type: `boolean`

### headingIdPandoc

When true appends pandoc-style {#...} heading identifiers where necessary. Note that independent from this setting input files may use pandoc-style heading identifiers for cross-linking by id.

`headingIdPandoc`

*   is optional

*   Type: `boolean`

### limitByAlternatives

This option can be used to limit the number of links, if there are multiple definitions of a term. When using a positive value, then the system creates links *no more than ...* alternative links. If the number is negative then the absolute amount indicates to *not link a term at all once there are at least ...* alternative definitions. For example:
1 linkifies the term in text and adds a link to 1 alternative definition (superscript),
0 only linkifies the term in text but adds 0 links to alternative definitions,
\-1 does not linkify a term in text once there is at least 1 alternative definition.
Negative values may also be helpful when using 'glossaries' option with a glob pattern and there are multiple documents that follow a certain template and thus repeatedly declare the same heading (= term).

`limitByAlternatives`

*   is optional

*   Type: `integer`

### limitByTermOrigin

Limits linkification based on the file hierarchy of a book project. For example, `["parent", "sibling", "self"]` causes a term occurrence being linkified only when a term has been defined in a glossary in a parent directory ("parent") or when it has been defined in a glossary next to the document file ("sibling") or within the glossary itself ("self"). The option allows for a hierarchy of glossaries e.g. a top-level glossary for common terms linked throughout a book and glossaries whose terms are being linked within a particular (sub-)directory/section branch, only. It may also provide a means of limiting auto-linking when the `glossaries` option is used with `file` wildcard patterns. Enumerating all elements is equivalent to keeping the array empty. It will make glossarify-md link each glossary term in every document. Defaults to `[]`.

`limitByTermOrigin`

*   is optional

*   Type: `string[]`

### byReferenceDefinition

When 'true' replaces markdown inline links with numbered references to a link reference definition list at the bottom of a markdown file. See 'Link Reference Definitions' on <http://commonmark.org>.

`byReferenceDefinition`

*   is optional

*   Type: `boolean`

## Definitions group unified

Reference this group by using

```json
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/unified"}
```



### rcPath

Path to an external *unified* configuration file as documented under <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>. See description of *unified* property why you may want such a configuration.

`rcPath`

*   is optional

*   Type: `string`

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
{"$ref":"https://raw.githubusercontent.com/about-code/glossarify-md/v6.3.0/conf/v5/schema.json#/$defs/dev"}
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
