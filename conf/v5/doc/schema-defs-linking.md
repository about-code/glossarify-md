# linking Properties



## baseUrl

The base url to use when creating absolute links to glossary.

`baseUrl`

*   is optional

*   Type: `string`

### baseUrl Constraints

**unknown format**: the value of this string must follow the format: `url`

## paths

Control how paths to linked documents will be constructed. Choosing "absolute" requires a "baseUrl" as well.

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

An array of numerical values each in a range of 1-6 denoting the depths of headings that should participate in term-based link creation ("linkification"). In case you have modified 'indexing.headingDepths', be aware that 'linking.headingDepths' makes only sense if it is a full subset of the items in 'indexing.headingDepths'.

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

| Value      | Explanation |
| :--------- | :---------- |
| `"github"` |             |
| `"md5"`    |             |
| `"sha256"` |             |

## limitByAlternatives

This option can be used to limit the number of links, if there are multiple definitions of a term. When using a positive value, then the system creates links *no more than ...* alternative links. If the number is negative then the absolute amount indicates to *not link a term at all once there are at least ...* alternative definitions. For example:
1 linkifies the term in text and adds a link to 1 alternative definition (superscript),
0 only linkifies the term in text but adds 0 links to alternative definitions,
\-1 does not linkify a term in text once there is at least 1 alternative definition.
Negative values may also be helpful when using 'glossaries' option with a glob pattern and there are multiple documents that follow a certain template and thus repeatedly declare the same heading (= term).

`limitByAlternatives`

*   is optional

*   Type: `integer`
