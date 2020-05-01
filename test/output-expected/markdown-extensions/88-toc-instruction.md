# [[[toc]] processing instruction](#processing-instruction)

-   GIVEN an input document with `[[toc]]` processing instruction,

-   THEN the system

    1.  MUST write an output document passing the instruction through _as is_
    2.  AND MUST NOT escape it the first bracket so create `\[[toc]]`

-   in order to fix #88.

**Test Area:**

[[toc]]
