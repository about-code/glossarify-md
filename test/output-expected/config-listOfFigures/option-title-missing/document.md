# [Testing option generateFiles.listOfFigures](#testing-option-generatefileslistoffigures)

GIVEN a config option `generateFiles.listOfFigures`
AND config `generateFiles.listOfFigures.title` is `undefined`
THEN a file `generateFiles.listOfFigures.file` MUST be generated successfully
AND the default title MUST be "Figures".

![Figure 1 depth 1][1]

[1]: ./figure.png
