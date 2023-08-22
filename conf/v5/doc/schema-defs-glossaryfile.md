# glossaryFile Properties

| Property              | Type      | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :-------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [export](#export)     | Merged    | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-export.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/export")     |
| [file](#file)         | `string`  | Required | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-file.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/file")         |
| [import](#import)     | `object`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfileimport.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/import")                 |
| [linkUris](#linkuris) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-linkuris.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/linkUris") |
| [sort](#sort)         | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-sort.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/sort")         |
| [showUris](#showuris) | Merged    | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-showuris.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/showUris") |
| [termHint](#termhint) | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-termhint.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/termHint") |
| [uri](#uri)           | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-glossaryfile-properties-uri.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/glossaryFile/properties/uri")           |

## export

Export terms from the markdown file as a JSON glossary. Output will contain JSON-LD mappings onto <http://w3.org/skos> for interoperability with knowledge organization systems supporting SKOS.

`export`

*   is optional

*   Type: merged type ([Details](schema-defs-glossaryfile-properties-export.md))

*   since: 6.0.0

## file

Name of the glossary file. Conventional default is *glossary.md*. You can use a glob pattern to enable cross-linking of headings across multiple files. Note that 'termHint' and 'title' will be ignored if 'file' is a glob pattern.

`file`

*   is required

*   Type: `string`

## import

Import a JSON glossary (see 'export'). Generates a glossary markdown file from imported terms. Advanced: if the optional 'jsonld' library is installed glossarify-md will assume the JSON file to be a JSON-LD file. If it contains mappings of its custom attribute names onto well-known names from the W3C SKOS vocabulary then glossarify-md may understand the file even if it has a different structure than files exported by glossarify-md itself.

`import`

*   is optional

*   Type: `object` ([Details](schema-defs-glossaryfileimport.md))

*   since: 6.0.0

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/import.md

## linkUris

Set this to true to hyperlink occurrences of a term to an 'authoritative' web glossary using a term's URI as lookup URL (default: false). May be used together with a glossary's 'uri' option. When 'linkUris' is 'true' glossarify-md uses the glossary markdown file as a source of link titles (tooltips) or for other internal processing, only, but won't generate links from documents to the markdown glossary, anymore, but from documents to an external web page.

`linkUris`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

## sort

If present, sort terms in output glossary. Default: None. See also i18n options.

`sort`

*   is optional

*   Type: `string`

### sort Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"asc"`  |             |
| `"desc"` |             |

## showUris

Whether to render a term's URI in the glossary (currently for imported glossaries, only). May be a markdown snippet using a placeholder `${uri}` to control URI formatting.

`showUris`

*   is optional

*   Type: merged type ([Details](schema-defs-glossaryfile-properties-showuris.md))

*   since: 6.0.0

### showUris Examples

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

## termHint

A symbol to append to a link to denote that the term refers to a glossary term.

`termHint`

*   is optional

*   Type: `string`

## uri

A namespace or vocabulary identifier used as a prefix to construct URIs for glossary terms. Term URIs may be used to identify a concept within a Semantic Web or Linked Data Context or just to locate an external web page with a human readable definition. See also option `linking.baseUrl`.

`uri`

*   is optional

*   Type: `string`

*   since: 6.0.0

### uri Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
