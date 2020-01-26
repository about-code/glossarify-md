# [Testing option generateFiles.listOfFigures](#testing-option-generatefileslistoffigures)

GIVEN a config option `generateFiles.listOfFigures`
AND config `indexing.groupByHeadingDepth === 0`
THEN a file `generateFiles.listOfFigures.file` MUST be generated successfully
AND the generated file MUST be a flat list of figures.

![Figure 1 depth 1][1]

## [Heading 2 Depth 2](#heading-2-depth-2)

![Figure 2 depth 2][2]

### [Heading 3 Depth 3](#heading-3-depth-3)

![Figure 3 depth 3][3]

#### [Heading 4 Depth 4](#heading-4-depth-4)

![Figure 4 depth 4][4]

### [Heading 5 Depth 3](#heading-5-depth-3)

![Figure 5 depth 3][5]

## [Heading 6 Depth 2](#heading-6-depth-2)

![Figure 6 depth 2][6]

### [Heading 7 Depth 3](#heading-7-depth-3)

![Figure 7 depth 3][7]

###### [Heading 8 Depth 6](#heading-8-depth-6)

![Figure 8 depth 6][8]

###### [Heading 9 Depth 2](#heading-9-depth-2)

![Figure 9 depth 2][9]

[1]: ./figure1.png

[2]: ./figure2.png

[3]: ./figure3.png

[4]: ./figure4.png

[5]: ./figure5.png

[6]: ./figure6.png

[7]: ./figure7.png

[8]: ./figure8.png

[9]: ./figure9.png
