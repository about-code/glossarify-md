# Testing option generateFiles.listOfFigures

## Image Reference Without Caption

![ref1]

GIVEN a config option `generateFiles.listOfFigures`
AND a document with

- a section *Image Reference*
- AND a reference `![ref1]`
- AND a definition `[ref1]: ../figure1.png`

THEN the reference MUST be correctly detected as an image
AND in the generated list of figures there MUST be a link *ref1*
AND the link must refer to section `./document.md#image-reference-without-caption`

[ref1]: ./figure.png

## Image Reference With Caption

![Test Figure][ref2]

GIVEN a config option `generateFiles.listOfFigures`
AND a document with

- a section *Image Reference*
- AND a reference `![Test Figure][ref2]`
- AND a definition `[ref2]: ../figure1.png`

THEN the reference MUST be correctly detected as an image
AND in the generated list of figures there MUST be a link *Test Figure*
AND the link must refer to section `./document.md#image-reference-with-caption`

[ref2]: ./figure.png
