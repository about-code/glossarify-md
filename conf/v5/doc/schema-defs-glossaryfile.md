# glossaryFile Properties



## export

Export terms from the markdown file as a JSON glossary. Output will contain JSON-LD mappings onto <http://w3.org/skos> for interoperability with knowledge organization systems supporting SKOS.

`export`

*   is optional

*   Type: `string`

## file

Name of the glossary file. Conventional default is *glossary.md*. You can use a glob pattern to enable cross-linking of headings across multiple files. Note that 'termHint' and 'title' will be ignored if 'file' is a glob pattern.

`file`

*   is optional

*   Type: `string`

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

### uri Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
