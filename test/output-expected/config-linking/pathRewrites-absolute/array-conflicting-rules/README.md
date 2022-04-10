# [Test Case](#test-case)

## [Expect](#expect)

GIVEN

*   a configuration `linking.pathRewrites`

    ```json
    {
      "linking": {
        "pathRewrites": {
          "KEY-1/": ["section-1-1/", "section-1-2/", "section-2-1/", "section-2-2/"],
          "KEY-2/": ["section-2-1/", "section-2-2/"]
        },
        "...": ""
      }
    }
    ```

*   AND two rewrite rules WITH two possible ways of rewriting `section-2-1/` and `section-2-2/`

THEN

*   for multiple test runs results MUST NOT vary between test runs (determinism)
*   AND paths with `section-1-1/` MUST be rewritten to `KEY-1/`
*   AND paths with `section-1-1/` MUST be rewritten to `KEY-1/`
*   AND paths with `section-2-1/` MUST be rewritten to `KEY-2/`
*   AND paths with `section-2-2/` MUST be rewritten to `KEY-2/`

## [Actual](#actual)

*   Link to [Term 1.1.1.1](http://my.org/chapter-1/KEY-1/page-1-1-1.md#term-1111)
*   Link to [Term 1.1.1.2](http://my.org/chapter-1/KEY-1/page-1-1-1.md#term-1112)
*   Link to [Term 1.1.1.3](http://my.org/chapter-1/KEY-1/page-1-1-1.md#term-1113)
*   Link to [Term 1.2.1.1](http://my.org/chapter-1/KEY-1/page-1-2-1.md#term-1211)
*   Link to [Term 1.2.1.2](http://my.org/chapter-1/KEY-1/page-1-2-1.md#term-1212)
*   Link to [Term 1.2.1.3](http://my.org/chapter-1/KEY-1/page-1-2-1.md#term-1213)
*   Link to [Term 2.0.1](http://my.org/chapter-2/page-2-0.md#term-201)
*   Link to [Term 2.0.2](http://my.org/chapter-2/page-2-0.md#term-202)
*   Link to [Term 2.0.3](http://my.org/chapter-2/page-2-0.md#term-203)
*   Link to [Term 2.1.1.1](http://my.org/chapter-2/KEY-2/page-2-1-1.md#term-2111)
*   Link to [Term 2.1.1.2](http://my.org/chapter-2/KEY-2/page-2-1-1.md#term-2112)
*   Link to [Term 2.1.1.3](http://my.org/chapter-2/KEY-2/page-2-1-1.md#term-2113)
*   Link to [Term 2.1.2.1](http://my.org/chapter-2/KEY-2/page-2-1-2.md#term-2121)
*   Link to [Term 2.1.2.2](http://my.org/chapter-2/KEY-2/page-2-1-2.md#term-2122)
*   Link to [Term 2.1.2.3](http://my.org/chapter-2/KEY-2/page-2-1-2.md#term-2123)
