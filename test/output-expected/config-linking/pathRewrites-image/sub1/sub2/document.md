# [Rewrite Image Urls](#rewrite-image-urls)

GIVEN a configuration...

```json
{
  "linking": {
    "baseUrl": "http://my.org/",
    "paths": "absolute",
    "pathRewrites": {
      "/static/$2.$3": ["(.*)/(.*).(png|jpg|svg|gif)"]
    },
    "byReferenceDefinition": false
  }
}
```

## [Test Case: Images](#test-case-images)

... AND inline image urls

```md
- ![Image Inline (png)](../../image/inline/foo.png)
- ![Image Inline (jpg)](../../image/inline/foo.jpg)
- ![Image Inline (gif)](../../image/inline/foo.gif)
```

THEN expected

```md
- ![Image Inline (png)](/static/foo.png)
- ![Image Inline (jpg)](/static/foo.jpg)
- ![Image Inline (gif)](/static/foo.gif)
```

must equal actual:

*   ![Image Inline (png)](/static/foo.png)
*   ![Image Inline (jpg)](/static/foo.jpg)
*   ![Image Inline (gif)](/static/foo.gif)

## [Test Case: Image References](#test-case-image-references)

... AND image references

```md
- ![Image Reference (png)][PNG]
- ![Image Reference (jpg)][JPG]
- ![Image Reference (gif)][GIF]

[PNG]: ../../image/ref/bar.png
[GIF]: ../../image/ref/bar.gif
[JPG]: ../../image/ref/bar.jpg
```

THEN expected

```md
- ![Image Reference (png)][PNG]
- ![Image Reference (jpg)][JPG]
- ![Image Reference (gif)][GIF]

[PNG]: /static/bar.png
[GIF]: /static/bar.gif
[JPG]: /static/bar.jpg
```

MUST equal actual:

*   ![Image Reference (png)][PNG]
*   ![Image Reference (jpg)][JPG]
*   ![Image Reference (gif)][GIF]

[PNG]: /static/bar.png

[GIF]: /static/bar.gif

[JPG]: /static/bar.jpg
