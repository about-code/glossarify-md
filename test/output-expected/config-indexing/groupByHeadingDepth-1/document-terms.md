# [Document](#document)

GIVEN a config option `generateFiles.indexFile`
AND config `indexing.groupByHeadingDepth === 1`
THEN a file `generateFiles.indexFile.file` MUST be generated successfully
AND the generated file MUST list each term alphabetically
AND for each term only headings at depth 1 MUST be listed.

[Term1][1] at depth 1

## [Heading 2 Depth 2](#heading-2-depth-2)

[Term1][1] at depth 2
[Term2][2] at depth 2

### [Heading 3 Depth 3](#heading-3-depth-3)

[Term1][1] at depth 3
[Term2][2] at depth 3

#### [Heading 4 Depth 4](#heading-4-depth-4)

[Term1][1] at depth 4
[Term2][2] at depth 4

### [Heading 5 Depth 3](#heading-5-depth-3)

[Term1][1] at depth 3 again
[Term2][2] at depth 3 again

## [Heading 6 Depth 2](#heading-6-depth-2)

[Term1][1] at depth 2 again
[Term2][2] at depth 2 again

### [Heading 7 Depth 3](#heading-7-depth-3)

[Term1][1] at depth 3 again
[Term2][2] at depth 3 again

###### [Heading 8 Depth 6](#heading-8-depth-6)

[Term1][1] at depth 6
[Term2][2] at depth 6

###### [Heading 9 Depth 2](#heading-9-depth-2)

[Term1][1] at depth 2 again
[Term2][2] at depth 2 again

[1]: ./glossary.md#term1 "Term1 description."

[2]: ./glossary.md#term2 "Term2 description."
