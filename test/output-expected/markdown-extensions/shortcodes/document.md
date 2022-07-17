# [Test: Shortcodes](#test-shortcodes)

[remark-shortcodes]: https://npmjs.com/package/remark-shortcodes

[Hugo]: https://gohugo.io

GIVEN

*   the plug-in [remark-shortcodes] installed
*   AND a configuration
    ```json
    {
      "unified": {
        "plugins": {
          "remark-shortcodes": {
            "startBlock": "{{<",
            "endBlock": "{{>"
          }
        }
      }
    }
    ```

...

## [Test Case 1: Glossary term with a shortcode](#test-case-1-glossary-term-with-a-shortcode)

*   ... AND a glossary term *[Shortcode][1]* WITH [Hugo] shortcode syntax

THEN

1.  the glossarify file MUST be written with the shortcodes *unmodified*
2.  AND the term occurrence SHOULD have an unmodified short description.

## [Test Case 2: Document with a shortcode](#test-case-2-document-with-a-shortcode)

...
THEN

*   the character sequence {{< shortcode >}}
*   AND character sequence *between* code fences `{{< shortcode >}}`

MUST be equal.

[1]: ./glossary.md#shortcode "Short description with a shortcode {{< lorem ipsum >}}."
