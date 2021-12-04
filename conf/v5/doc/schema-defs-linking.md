# linking Properties



## baseUrl

The base URL to use for (web-)linking. Use `paths: "absolute"` to (cross-)link terms by their term URLs rather than by relative file paths. A term URL is a combination of `baseUrl` + `path,file,ext` + `#term-fragment` where `path,file,ext` can be customized using `linking.pathComponents`. Linked Data URIs: A term URL will be considered a term's (vocabulary) URI, too. However, if the term URL can not be guaranteed to be a *long lasting* identifier for the term's definition or doesn't match its predefined URI, then you might want to declare a dedicated URI per glossary. It will be used as an URI prefix to the glossary's terms (see also option `glossaries[i].uri`).

`baseUrl`

*   is optional

*   Type: `string`

### baseUrl Constraints

**unknown format**: the value of this string must follow the format: `url`

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

## headingDepths

An array of numerical values each in a range of 1-6 denoting the depths of headings that should participate in term-based link creation ("linkification"). Note the dependency on `indexing.headingDepths`: The latter controls which headings to index as "terms" *at all* so only indexed headings can be linkified at all. As you likely guess this means that configuring `indexing.headingDepths: [1]` but `linking.headingDepths:[1,2]` would *not* linkify term headings at depth `2` because they haven't been indexed, before. Instead with `indexing.headingDepths: [1,2,3]` *they would* because then headings at depth 1 to 3 would be indexed which includes headings at depth `2`, of course. Or long story short: `linking.headingDepths` is expected to be a fully enclosed subset of `indexing.headingDepths`.

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

## headingAsLink

Whether to linkify headings. Some Markdown-to-HTML renderers may require this is to be true to generate navigable HTML (e.g. VuePress and GitHub's MD preview). You may be able to use 'false' when other reference mechanisms are in place, such as pandoc-style {#...} header attributes.

`headingAsLink`

*   is optional

*   Type: `boolean`

## headingIdPandoc

When true appends pandoc-style {#...} heading identifiers where necessary. Note that independent from this setting input files may use pandoc-style heading identifiers for cross-linking by id.

`headingIdPandoc`

*   is optional

*   Type: `boolean`

## limitByAlternatives

This option can be used to limit the number of links, if there are multiple definitions of a term. When using a positive value, then the system creates links *no more than ...* alternative links. If the number is negative then the absolute amount indicates to *not link a term at all once there are at least ...* alternative definitions. For example:
1 linkifies the term in text and adds a link to 1 alternative definition (superscript),
0 only linkifies the term in text but adds 0 links to alternative definitions,
\-1 does not linkify a term in text once there is at least 1 alternative definition.
Negative values may also be helpful when using 'glossaries' option with a glob pattern and there are multiple documents that follow a certain template and thus repeatedly declare the same heading (= term).

`limitByAlternatives`

*   is optional

*   Type: `integer`

## byReferenceDefinition

When 'true' replaces markdown inline links with numbered references to a link reference definition list at the bottom of a markdown file. See 'Link Reference Definitions' on <http://commonmark.org>.

`byReferenceDefinition`

*   is optional

*   Type: `boolean`
