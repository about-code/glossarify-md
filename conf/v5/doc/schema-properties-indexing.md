## indexing Default Value

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

# indexing Properties



## groupByHeadingDepth

Level of detail by which to group occurrences of terms or syntactic elements in generated files (Range \[min, max]: \[0, 6]). For example, use 0 to not group at all; 1 to group things at the level of document titles, etc. Configures the indexer. The option affects any files generated from the internal AST node index.

`groupByHeadingDepth`

*   is optional

*   Type: `integer`

### groupByHeadingDepth Constraints

**maximum**: the value of this number must smaller than or equal to: `6`

**minimum**: the value of this number must greater than or equal to: `0`

## headingDepths

An array with items in a range of 1-6 denoting the depths of headings that should be indexed. Excluding some headings from indexing is mostly a performance optimization, only. You can just remove the option from your config or stick with defaults. Change defaults only if you are sure that you do not want to have cross-document links onto headings at a particular depth, no matter whether the link was created automatically or written manually.
The relation to 'linking.headingDepths' is that *this* is about "knowing the link targets" whereas the other is about "creating links" ...based on knowledge about link targets. Yet, indexing of headings is further required for existing (cross-)links like `[foo](#heading-id)` and resolving the path to where a heading with such id was declared, so for example `[foo](../document.md#heading-id)`.

`headingDepths`

*   is optional

*   Type: `integer[]`
