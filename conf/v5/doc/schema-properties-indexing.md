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

An array with items in a range of 1-6 denoting the depths of headings that should be indexed for cross-linking. Most of the time `linking.headingDepths` should be preferred to exclude certain headings from term-based auto linking. Excluding headings from indexing not only affects auto-linking but more such as path resolution for manual ID-based cross-links, generation of lists or book indexes and other features. Excluding headings from indexing is mostly a performance optimization applicable when headings at a particular level are never used or never required to be linkified.

`headingDepths`

*   is optional

*   Type: `integer[]`
