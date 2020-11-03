# Anchorization

GIVEN any of

- `generateFiles.listOfFigures` OR
- `generateFiles.listOfTables` OR
- `generateFiles.listOf`
- AND a minimum distance HTML_TO_IMAGE_MIN_DISTANCE = 3

THEN the system MUST annotate input documents with anchors as follows:

## Images

### Test Case: No HTML node in neigbourhood.

- GIVEN an input document

  ~~~md
  Text without an HTML closely preceding ![image-title1](./image1.png)
  ~~~

- WITH a Markdown image reference
- AND NOT preceded by an HTML node at a node distance lower or equal to HTML_TO_IMAGE_MIN_DISTANCE
- THEN the system MUST prepend an anchor such that the output document matches

  ~~~md
  Text without an HTML closely preceding <a id="figure1" class="figure" title="image-title1"></a>![image-title1](./image1.png)
  ~~~

#### Test Data

Text without an HTML closely preceding ![image-title1](./image.png)


### Test Case: HTML node as direct predecessor

- GIVEN an input document

  ~~~md
  Text with an HTML anchor <a id="my-figure2" class="figure"></a>![image-title2](./image2.png)
  ~~~

- WITH a Markdown image reference already being annotated with an HTML anchor
- AND thus with an HTML node distance being lower than HTML_TO_IMAGE_MIN_DISTANCE
- THEN the system MUST not prepend yet another anchor.

#### Test Data

Text with an HTML anchor <a id="my-figure2" class="figure"></a>![image-title2](./image2.png)


### Test Case: HTML node in standalone paragraph

- GIVEN an input document

  ~~~md
  <a id="my-figure3" class="figure"></a>

  ![image-title3](./image3.png)
  ~~~

- WITH a Markdown image reference preceded by a paragraph with a single HTML child
- AND thus with an HTML node distance being lower than HTML_TO_IMAGE_MIN_DISTANCE
- THEN the system CAN NOT prepend yet another anchor.

#### Test Data

<a id="my-figure3" class="figure"></a>

![image-title3](./image3.png)


### Test Case: HTML node terminating previous paragraph

- GIVEN an input document

  ~~~md
  Previous paragraph ends with an HTML node <a id="my-figure4" class="figure"></a>

  ![image-title4](./image4.png)
  ~~~

- WITH a Markdown image reference preceded by a paragraph ending with an HTML child
- AND thus with an HTML node distance being lower than HTML_TO_IMAGE_MIN_DISTANCE
- THEN the system MUST not prepend yet another anchor.

#### Test Data

Previous paragraph ends with an HTML node  <a id="my-figure4" class="figure"></a>

![image-title4](./image4.png)


### Test Case: 'html' node then 'text' node then 'image' node

- GIVEN an input document

  ~~~md
  <a id="my-other-figure" class="figure"></a>

  Image embedded in text: ![image-title5](./image5.png)
  ~~~

- WITH a paragraph with a single HTML child
- AND a Markdown image reference preceded by text
- AND thus with an HTML node distance higher than HTML_TO_IMAGE_MIN_DISTANCE
- THEN the system MUST prepend an anchor to the image node such that the output document matches

  ~~~md
  <a id="my-other-figure" class="figure"></a>

  Image embedded in text: <a id="figure5" class="figure" title="image-title5"></a>![image-title5](./image5.png)
  ~~~

#### Test Data

<a id="my-other-figure" class="figure"></a>

Image embedded in text: ![image-title5](./image5.png)
