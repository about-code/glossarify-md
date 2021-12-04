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

An array with items in a range of 1-6 denoting the depths of headings that should be indexed for cross-linking. Excluding headings from indexing is mostly a performance optimization, applicable when only headings at a particular depth should participate in id-based cross-linking or term-based auto linking. Note that it is possible to keep indexing all headings to support manually written id-based cross-links for all headings but restricting auto-linking to a subset of headings at a particular depth using `linking.headingDepths` (see `linking` options).

`headingDepths`

*   is optional

*   Type: `integer[]`
