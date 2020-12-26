---
key: this is a frontmatter
---

# [Test Case](#test-case)

GIVEN

*   *this* document WITH a frontmatter
    ```yaml
    ---
    key: this is a frontmatter
    ---
    ```
*   AND a glossarify-md configuration with an *internal* [unified configuration][unified]
    ```json
    {
      "unified": {
        "plugins": {
          "remark-frontmatter": {
            "type": "yaml",
            "marker": "-"
          }
        }
      }
    }
    ```
*   AND [remark-frontmatter] is an npm dependency of the test-suite
*   AND [remark-frontmatter] was installed into the test-suite's `node_modules` directory

THEN the system

*   MUST pass the [unified configuration][unified] to unified
*   AND unified MUST load plug-in [remark-frontmatter]
*   AND the frontmatter MUST NOT be parsed partially into a heading (because without the plug-in the sequence...
    ```yaml
    key: this is a frontmatter
    ---
    ```
    ...is syntactically equal to a markdown heading)

[unified]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

[remark-frontmatter]: https://npmjs.com/package/remark-frontmatter

*   AND the frontmatter in the output document MUST use the marker style configured for [remark-frontmatter]
