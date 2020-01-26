# Document

GIVEN a config option `generateFiles.indexFile`
AND config `indexing.groupByHeadingDepth === 1`
THEN a file `generateFiles.indexFile.file` MUST be generated successfully
AND the generated file MUST list each term alphabetically
AND for each term only headings at depth 1 MUST be listed.

Term1 at depth 1

## Heading 2 Depth 2

Term1 at depth 2
Term2 at depth 2

### Heading 3 Depth 3

Term1 at depth 3
Term2 at depth 3

#### Heading 4 Depth 4

Term1 at depth 4
Term2 at depth 4

### Heading 5 Depth 3

Term1 at depth 3 again
Term2 at depth 3 again

## Heading 6 Depth 2

Term1 at depth 2 again
Term2 at depth 2 again

### Heading 7 Depth 3

Term1 at depth 3 again
Term2 at depth 3 again

###### Heading 8 Depth 6

Term1 at depth 6
Term2 at depth 6

###### Heading 9 Depth 2

Term1 at depth 2 again
Term2 at depth 2 again
