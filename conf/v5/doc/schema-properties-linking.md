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

## headingAsLink

Whether to linkify headings. Some Markdown-to-HTML renderers may require this is to be true to generate navigable HTML (e.g. VuePress and GitHub's MD preview). You may be able to use 'false' when other reference mechanisms are in place, such as pandoc-style {#...} header attributes.

`headingAsLink`

*   is optional

*   Type: `boolean`

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

## limitByAlternatives

This option can be used to deal with ambiguities and limit the number of links in case of multiple definitions for a term. For example, a value of
5: makes the system link to *at most 5* additional definitions per term
0: links the term to a single definition but adds no hint or links to alternative definitions (even if there are any)
-1: makes the system stop linking a term once there is at least 1 additional definition (ambiguity)
-5: makes the system stop linking a term once there are *at least 5* additional definitions
. Negative values may also be helpful when using 'glossaries' option with a glob pattern and in presence of multiple documents that follow a certain heading template such that the same heading appears more than once. Since v7.1.0 you can combine this with 'sortAlternatives' which provides algorithms for sorting the most relevant definitions to the front of a list.

`limitByAlternatives`

*   is optional

*   Type: `integer`

## limitByTermOrigin

Limits linkification based on the filesystem hierarchy of a book project. For example, `["parent", "sibling", "self"]` causes a term occurrence being linkified only when a term has been defined in a glossary in a parent directory ("parent") or when it has been defined in a glossary next to the document file ("sibling") or within the glossary itself ("self"). The option allows for a hierarchy of glossaries e.g. a top-level glossary for common terms linked throughout a book and glossaries whose terms are being linked within a particular (sub-)directory/section branch, only. It may also provide a means of limiting auto-linking when the `glossaries` option is used with `file` wildcard patterns. Enumerating all elements is equivalent to keeping the array empty. It will make glossarify-md link each glossary term in every document. Defaults to `[]`.

`limitByTermOrigin`

*   is optional

*   Type: `string[]`

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

### pathComponents Constraints

**maximum number of items**: the maximum number of items for this array is: `3`

## pathRewrites

KEY-VALUE map where VALUE is a single search string or an array of strings or regular expressions (RegExp) and KEY is the replacement/rewrite string. Path rewriting won't change the output folder structure but is intended to be used when output folder structure changes after glossarify-md's own processing. Other glossarify-md options affect link paths and URLs and need to be considered in rewrite rules. Be aware that *URLs* can only be rewritten when the URL is based on 'baseUrl'. If you need path rewriting because the published directory layout differs from 'outDir' then you may find rewriting absolute paths ('paths: absolute') or URLs based on 'baseUrl' easier than than rewriting relative paths. Relative paths can be harder to get right and thus are more likely to result in dead links.

`pathRewrites`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-pathrewrites.md))

## sortAlternatives

When there are multiple glossaries a term could have multiple definitions. This option lets you choose from different algorithms for sorting and priortizing glossary definitions. The primary definition will be considered the first definition in the list of definitions. It will be the one used to link the ambiguous term's phrase in the text. Other definitions become numerical shortlinks to supplementary definitions ordered according to their priority. Whether supplementary definitions are being rendered at all depends on option 'limitByAlternatives'.

Selecting an algorithm: typically, you want to have a term's phrase linking to the term definition which is 'most appropriate' in the context of the term's usage. What 'most appropriate' means in a particular situation is hard for computers to truly understand. Computationally, we can try to find 'probability measures' which indicate appropriateness, numerically. With such a numerical representation we can then establish a (numerical) order and sort/prioritize term definitions from 'most likely appropriate' to 'least likely appropriate'. For strength and weaknesses of available algorithms, see the documentation given for property 'by' after selecting the particular algorithm.

`sortAlternatives`

*   is optional

*   Type: merged type ([Details](schema-defs-linking-properties-sortalternatives.md))

### sortAlternatives Default Value

The default value is:

```json
{
  "by": "glossary-filename"
}
```

## sortAlternativesByFileName



`sortAlternativesByFileName`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-sortalternativesbyfilename.md))

## sortAlternativesByRefCount



`sortAlternativesByRefCount`

*   is optional

*   Type: `object` ([Details](schema-defs-linking-properties-sortalternativesbyrefcount.md))
