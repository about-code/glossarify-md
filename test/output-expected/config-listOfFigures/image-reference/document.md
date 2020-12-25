# [Testing option generateFiles.listOfFigures](#testing-option-generatefileslistoffigures)

## [Image Reference Without Caption](#image-reference-without-caption)

<a id="ref1" class="figure" title="ref1"></a>![ref1]

GIVEN a config option `generateFiles.listOfFigures`
AND a document with

*   a section *Image Reference*
*   AND a reference `![ref1]`
*   AND a definition `[ref1]: ../figure1.png`

THEN the reference MUST be correctly detected as an image
AND in the generated list of figures there MUST be a link *ref1*
AND the link must refer to section `./document.md#image-reference-without-caption`

[ref1]: ./figure.png

## [Image Reference With Caption](#image-reference-with-caption)

<a id="test-figure" class="figure" title="Test Figure"></a>![Test Figure][ref2]

GIVEN a config option `generateFiles.listOfFigures`
AND a document with

*   a section *Image Reference*
*   AND a reference `![Test Figure][ref2]`
*   AND a definition `[ref2]: ../figure1.png`

THEN the reference MUST be correctly detected as an image
AND in the generated list of figures there MUST be a link *Test Figure*
AND the link must refer to section `./document.md#image-reference-with-caption`

[ref2]: ./figure.png
