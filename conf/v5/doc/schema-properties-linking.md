## linking Default Value

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

# linking Properties

| Property                                                                        | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                                              |
| :------------------------------------------------------------------------------ | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [baseUrl](#baseurl)                                                             | `string`      | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-baseurl.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/baseUrl")                                                             |
| [byReferenceDefinition](#byreferencedefinition)                                 | `boolean`     | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-byreferencedefinition.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/byReferenceDefinition")                                 |
| [headingAsLink](#headingaslink)                                                 | `boolean`     | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-headingaslink.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/headingAsLink")                                                 |
| [headingDepths](#headingdepths)                                                 | `array`       | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-headingdepths.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/headingDepths")                                                 |
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

## baseUrl

The base URL to use for (web-)linking. Use `paths: "absolute"` to (cross-)link terms by their term URLs rather than by relative file paths. A term URL is a combination of `baseUrl` + `path,file,ext` + `#term-fragment` where `path,file,ext` can be customized using `linking.pathComponents`. Linked Data URIs: A term URL will be considered a term's (vocabulary) URI, too. However, if the term URL can not be guaranteed to be a *long lasting* identifier for the term's definition or doesn't match its predefined URI, then you might want to declare a dedicated URI per glossary. It will be used as an URI prefix to the glossary's terms (see also option `glossaries[i].uri`).

`baseUrl`

*   is optional

*   Type: `string`

### baseUrl Constraints

**unknown format**: the value of this string must follow the format: `url`

## byReferenceDefinition

When 'true' replaces markdown inline links with numbered references to a link reference definition list at the bottom of a markdown file. See 'Link Reference Definitions' on <http://commonmark.org>.

`byReferenceDefinition`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

## headingAsLink

Whether to linkify headings. Some Markdown-to-HTML renderers may require this is to be true to generate navigable HTML (e.g. VuePress and GitHub's MD preview). You may be able to use 'false' when other reference mechanisms are in place, such as pandoc-style {#...} header attributes.

`headingAsLink`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

## headingDepths

An array of numerical values each in a range of 1-6 denoting the headings level that should participate in term-based auto linking. Note that indexing the given levels is a prerequisite (see `indexing.headingDepths`). So configuring `indexing.headingDepths: [1]` but `linking.headingDepths:[1,2]` would *not* linkify term headings at depth `2`. Instead with `indexing.headingDepths: [1,2,3]` *would*.

`headingDepths`

*   is optional

*   Type: `integer[]`

## headingIdAlgorithm

Algorithm to use for generating heading IDs. The "github" algorithm (default) produces easier to read IDs but only guarantees uniqueness per file. Use one of the cryptographic hash functions to have IDs be unique across all output files. Hash functions are likely to be required when concatenating output files with tools like pandoc ( <https://pandoc.org> ).

`headingIdAlgorithm`

*   is optional

*   Type: unknown

*   since: 6.0.0

### headingIdAlgorithm Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"github"`   |             |
| `"md5"`      |             |
| `"md5-7"`    |             |
| `"sha256"`   |             |
| `"sha256-7"` |             |

## headingIdPandoc

When true appends pandoc-style {#...} heading identifiers where necessary. Note that independent from this setting input files may use pandoc-style heading identifiers for cross-linking by id.

`headingIdPandoc`

*   is optional

*   Type: `boolean`

*   since: 6.0.0

## limitByAlternatives

This option can be used to deal with ambiguities and limit the number of links in case of multiple definitions for a term. For example, a value of
`5` makes the system link to *at most 5* additional definitions per term
. The value `0` links the term to a single definition but adds zero additional links indicating alternative definitions even if there are any. Since v7.1.0 we recommend not only but especially for value `0` to combine it with 'sortAlternatives'. This increases the likelihood that the one definition being linked is the one appropriate in the context of a term's usage.
A value of `-1` makes the system stop linking a term once there is at least 1 additional definition (stops linking ambiguous terms, completely)
`-5` makes the system stop linking a term once there are *at least 5* additional definitions

. Negative values may also be helpful when using option 'glossaries.file' with a glob pattern where the glob pattern matches many documents that share a common heading template. Then the repetitive use of the template causes ambiguity and leads to many alternative links being rendered. Use this option, for example, to limit their number.

`limitByAlternatives`

*   is optional

*   Type: `integer`

## limitByTermOrigin

This option can be used to deal with ambiguities when there are multiple glossaries with competing definitions for a term. It can restrict the applicable scope of a glossary based on the directory structure and glossary file locations of a book project. For example, `["parent", "sibling", "self"]` causes a term occurrence being linkified only in documents when the term has been defined in a glossary in a parent directory ("parent") or when it has been defined in a glossary next to the document file ("sibling") or within the glossary itself ("self"). The option allows for a hierarchy of glossaries e.g. a top-level glossary for common terms linked throughout a book and glossaries whose terms are being linked within a particular (sub-)directory/section branch, only. It may also provide a means of limiting auto-linking when the `glossaries` option is used with `file` wildcard patterns. It can also be a manual approach to improving linkification for ambiguous terms when the fuzzyness of 'linking.sortAlternatives' is impractical.  Defaults to `[]`. An array containing all enum values is equivalent to an empty array. It will make glossarify-md link each glossary term in every document.

`limitByTermOrigin`

*   is optional

*   Type: `string[]`

*   since: 6.1.0

## mentions

Control the link density and whether every occurrence of a term in your documents should be linked with its glossary definition or only the first occurrence within a particular range.

`mentions`

*   is optional

*   Type: `string`

### mentions Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                  | Explanation |
| :--------------------- | :---------- |
| `"all"`                |             |
| `"first-in-paragraph"` |             |

## paths

Control how paths to linked documents will be constructed. When choosing "absolute" you may set a "baseUrl" as well. Without a base URL absolute file system paths will be generated.

`paths`

*   is optional

*   Type: `string`

### paths Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"relative"` |             |
| `"absolute"` |             |
| `"none"`     |             |

## pathComponents

Adjust which path components should make it into auto-generated links. glossarify-md won't rewrite your own links.

`pathComponents`

*   is optional

*   Type: `string[]`

*   since: 6.0.0

### pathComponents Constraints

**maximum number of items**: the maximum number of items for this array is: `3`

## pathRewrites

KEY-VALUE map where VALUE is a single search string or an array of strings or regular expressions (RegExp) and KEY is the replacement/rewrite string. Path rewriting won't change the output folder structure but is intended to be used when output folder structure changes after glossarify-md's own processing. Other glossarify-md options affect link paths and URLs and need to be considered in rewrite rules. Be aware that *URLs* can only be rewritten when the URL is based on 'baseUrl'. If you need path rewriting because the published directory layout differs from 'outDir' then you may find rewriting absolute paths ('paths: absolute') or URLs based on 'baseUrl' easier than than rewriting relative paths. Relative paths can be harder to get right and thus are more likely to result in dead links.

`pathRewrites`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-pathrewrites.md))

*   since: 6.1.0

## sortAlternatives

When there are multiple glossaries a term could have multiple definitions (ambiguity). This option lets you choose from different algorithms for sorting and priortizing glossary definitions. The primary definition will be considered the first definition in the sorted list of definitions. It will be the one used to link the phrase of an ambiguous term occurrence in the text. Other definitions become numerical shortlinks to supplementary definitions ordered according to their priority. Whether supplementary definitions are being rendered at all depends on option 'limitByAlternatives'.

`sortAlternatives`

*   is optional

*   Type: merged type ([Details](schema-defs-linking-properties-sortalternatives.md))

*   since: 7.1.0

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/ambiguities.md

### sortAlternatives Default Value

The default value is:

```json
{
  "by": "glossary-filename"
}
```

### sortAlternatives Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-ref-count",
    "perSectionDepth": 2
  }
}
```

## sortAlternatives.by.glossary-filename

Sorting alternative definitions by glossary file name sorts links to those glossary definitions created for term occurrences by comparing the file names of the glossaries hosting the to-be-linked term definitions. The sort algorithm assumes that there is only a single definition for a term in a single glossary file.

`sortAlternatives.by.glossary-filename`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-sortalternativesbyglossary-filename.md))

### sortAlternatives.by.glossary-filename Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-filename"
  }
}
```

## sortAlternatives.by.glossary-ref-count

Sorting alternative definitions by glossary reference count sorts links to those glossary definitions by comparing the popularity of glossaries hosting the to-be-linked term definitions. It assumes a glossary to be more popular when its terms have occured (referenced, cited) more often in a section. In particular it assumes the most popular glossary in a section to provide the likely most appropriate definition when there competing definitions.

`sortAlternatives.by.glossary-ref-count`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-sortalternativesbyglossary-ref-count.md))

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/ambiguities.md

### sortAlternatives.by.glossary-ref-count Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-ref-count",
    "perSectionDepth": 2
  }
}
```
