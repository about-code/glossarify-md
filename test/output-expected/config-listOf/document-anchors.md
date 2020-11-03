# [Anchorization](#anchorization)

GIVEN any of

-   `generateFiles.listOfFigures` OR
-   `generateFiles.listOfTables` OR
-   `generateFiles.listOf`

THEN the system MUST annotate input documents with anchors as follows
(achievable with an html-to-image-node-distance of 3):

## [Images](#images)

### [Test Case 1: No HTML node in close neigbourhood.](#test-case-1-no-html-node-in-close-neigbourhood)

-   GIVEN an input document

    ```md
    Text without an HTML closely preceding ![image-title1](./image1.png)
    ```

-   WITH a Markdown image reference

-   THEN the system MUST prepend an anchor such that the output document matches

    ```md
    Text without an HTML closely preceding <a id="figure1" class="figure" title="image-title1"></a>![image-title1](./image1.png)
    ```

#### [Test Data](#test-data)

Text without an HTML closely preceding <a id="image-title1" class="figure" title="image-title1"></a>![image-title1][1]

### [Test Case 2.1: HTML node as direct predecessor](#test-case-21-html-node-as-direct-predecessor)

-   GIVEN an input document

    ```md
    Text with an HTML anchor <a id="my-figure21" class="figure"></a>![image-title21](./image21.png)
    ```

-   WITH a Markdown image reference already being annotated with an HTML anchor

-   THEN the system MUST NOT prepend yet another anchor.

#### [Test Data](#test-data-1)

Text with an HTML anchor <a id="my-figure21" class="figure"></a>![image-title21][2]

### [Test Case 2.2: HTML node as close predecessor separated by space](#test-case-22-html-node-as-close-predecessor-separated-by-space)

-   GIVEN an input document

    ```md
    Text with an HTML anchor <a id="my-figure22" class="figure"></a> ![image-title22](./image22.png)
    ```

-   WITH a Markdown image reference already being annotated with an HTML anchor separated by space

-   THEN the system MUST NOT prepend yet another anchor.

#### [Test Data](#test-data-2)

Text with an HTML anchor <a id="my-figure22" class="figure"></a> ![image-title22][3]

### [Test Case 3.1: HTML node in standalone paragraph](#test-case-31-html-node-in-standalone-paragraph)

-   GIVEN an input document

    ```md
    <a id="my-figure31" class="figure"></a>

    ![image-title31](./image31.png)
    ```

-   WITH a Markdown image reference preceded by a paragraph with a single HTML child

-   THEN the system MUST NOT prepend yet another anchor.

#### [Test Data](#test-data-3)

<a id="my-figure31" class="figure"></a>

![image-title31][4]

### [Test Case 3.2: HTML node terminating previous paragraph](#test-case-32-html-node-terminating-previous-paragraph)

-   GIVEN an input document

    ```md
    Previous paragraph ends with an HTML node <a id="my-figure32" class="figure"></a>

    ![image-title32](./image32.png)
    ```

-   WITH a Markdown image reference preceded by a paragraph ending with an HTML child

-   THEN the system MUST NOT prepend yet another anchor.

#### [Test Data](#test-data-4)

Previous paragraph ends with an HTML node  <a id="my-figure32" class="figure"></a>

![image-title32][5]

### [Test Case 3.3: HTML node in paragraph with text before image](#test-case-33-html-node-in-paragraph-with-text-before-image)

-   GIVEN an input document

    ```md
    <a id="my-other-figure" class="figure"></a>

    Image embedded in text: ![image-title33](./image33.png)
    ```

-   WITH a paragraph with a single HTML child

-   AND a Markdown image reference preceded by text

-   THEN the system MUST prepend an anchor to the image node such that the output document matches

    ```md
    <a id="my-other-figure" class="figure"></a>

    Image embedded in text: <a id="figure33" class="figure" title="image-title33"></a>![image-title33](./image33.png)
    ```

#### [Test Data](#test-data-5)

<a id="my-other-figure" class="figure"></a>

Image embedded in text: <a id="image-title33" class="figure" title="image-title33"></a>![image-title33][6]

[1]: ./image.png

[2]: ./image21.png

[3]: ./image22.png

[4]: ./image31.png

[5]: ./image32.png

[6]: ./image33.png
