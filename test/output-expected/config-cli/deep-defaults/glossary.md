# [Glossary](#glossary)

## [Test Case](#test-case)

-   GIVEN a configuration schema WITH a complex option `glossaries` WITH a complex `default` value

     _./node_modules/glossarify-md/conf.schema.json_:

    ```json
    {
        "$id": "...",
        "properties": {
            "glossaries": {
                "default": [
                    { "file": "./glossary.md", "termHint": ""}
                ],
                "...": "...",
            },
            "...": "..."
        }
    }
    ```

-   AND a configuration file with an incomplete _partial_ definition of the complex object `glossaries`

     _Some partial user configuration_

    ```json
    {
        "$schema": "./node_modules/glossarify-md/conf.schema.json",
        "glossaries": [],
        "...": "..."
    }
    ```

-   THEN the default values MUST be _deep-merged_ into the configuration file such that the actual configuration applied is identical to a configuration file

     _Expected config to apply_

    ```json
    {
        "$schema": "./node_modules/glossarify-md/conf.schema.json",
        "glossaries": [
            { "file": "./glossary.md", "termHint": ""}
        ],
        "...": "..."
    }
    ```
