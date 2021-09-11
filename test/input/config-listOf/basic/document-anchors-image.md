# Anchorization

GIVEN any of

- `generateFiles.listOfFigures` OR
- `generateFiles.listOfTables` OR
- `generateFiles.listOf`

THEN the system MUST annotate input documents with anchors as follows
(achievable with an html-to-image-node-distance of 3):

## Images

### Test Case 1: No HTML node in close neigbourhood.

- GIVEN an input document

  ~~~md
  Text without an HTML closely preceding ![image-title1](./image1.png)
  ~~~

- WITH a Markdown image reference
- THEN the system MUST prepend an anchor

#### Test Data

Text without an HTML closely preceding ![image-title1](./image.png)


### Test Case 2.1: HTML node as direct predecessor

- GIVEN an input document

  ~~~md
  Text with an HTML anchor <a id="my-figure21" class="figure"></a>![image-title21](./image21.png)
  ~~~

- WITH a Markdown image reference already being annotated with an HTML anchor
- THEN the system MUST NOT prepend yet another anchor.

#### Test Data

Text with an HTML anchor <a id="my-figure21" class="figure"></a>![image-title21](./image21.png)


### Test Case 2.2: HTML node as close predecessor separated by space

- GIVEN an input document

  ~~~md
  Text with an HTML anchor <a id="my-figure22" class="figure"></a> ![image-title22](./image22.png)
  ~~~

- WITH a Markdown image reference already being annotated with an HTML anchor separated by space
- THEN the system MUST NOT prepend yet another anchor.

#### Test Data

Text with an HTML anchor <a id="my-figure22" class="figure"></a> ![image-title22](./image22.png)


### Test Case 3.1: HTML node in standalone paragraph

- GIVEN an input document

  ~~~md
  <a id="my-figure31" class="figure"></a>

  ![image-title31](./image31.png)
  ~~~

- WITH a Markdown image reference preceded by a paragraph with a single HTML child
- THEN the system MUST NOT prepend yet another anchor.

#### Test Data

<a id="my-figure31" class="figure"></a>

![image-title31](./image31.png)


### Test Case 3.2: HTML node terminating previous paragraph

- GIVEN an input document

  ~~~md
  Previous paragraph ends with an HTML node <a id="my-figure32" class="figure"></a>

  ![image-title32](./image32.png)
  ~~~

- WITH a Markdown image reference preceded by a paragraph ending with an HTML child
- THEN the system MUST NOT prepend another anchor.

#### Test Data

Previous paragraph ends with an HTML node <a id="my-figure32" class="figure"></a>

![image-title32](./image32.png)


### Test Case 3.3: HTML node in paragraph with text before image

- GIVEN an input document

  ~~~md
  <a id="my-other-figure" class="figure"></a>

  Image embedded in text: ![image-title33](./image33.png)
  ~~~

- WITH a paragraph with a single HTML child
- AND a Markdown image reference preceded by text
- THEN the system MUST prepend an anchor to the image node

#### Test Data

<a id="my-other-figure" class="figure"></a>

Image embedded in text: ![image-title33](./image33.png)


### Test Case 4: Unique IDs

- GIVEN an input document

  ~~~md
  First  Image ![image-title4](./image4.png)
  Second Image ![image-title4](./image4.png)
  ~~~

- WITH two images
- AND same image titles
- THEN the system MUST prepend anchors with unique IDs

#### Test Data

First  Image ![image-title4](./image4.png)
Second Image ![image-title4](./image4.png)
