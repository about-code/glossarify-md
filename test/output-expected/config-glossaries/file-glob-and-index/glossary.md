# [Testing Index generation for glossaries file glob](#testing-index-generation-for-glossaries-file-glob)

*   GIVEN a configuration

    ```json
    "generateFiles": {
     "indexFile": { "file": "./index/generated.md"}
    },
    "glossaries": [{
        "file": "./**/document.md"
    }]
    ```

*   WITH a configuration to generate an Index file into a subdirectory

*   AND `glossaries.file` being a glob pattern

*   AND this document mentioning term *[Second Level][1]*

*   AND document `./2nd/glossary.md` mentioning `Third Level`

*   THEN the links to term definitions generated in the Index file MUST be relative

*   AND MUST begin with `../` to step out of the `./index/` directory

[1]: ./2nd/glossary2.md#second-level "Test: Mentioning term Third Level"
