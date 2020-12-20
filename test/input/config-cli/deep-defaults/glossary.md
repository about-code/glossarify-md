# Glossary

## Test Case

- GIVEN a configuration schema WITH a complex option `glossaries` WITH a complex `default` value

   *Schema*:
    ~~~json
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
    ~~~
- AND a configuration file with an incomplete *partial* definition of the complex object `glossaries`

   *Some partial user configuration*
    ~~~json
    {
        "glossaries": [],
        "...": "..."
    }
    ~~~

- THEN the default values MUST be *deep-merged* into the configuration file such that the actual configuration applied is identical to a configuration file

   *Expected config to apply*
    ~~~json
    {
        "glossaries": [
            { "file": "./glossary.md", "termHint": ""}
        ],
        "...": "..."
    }
    ~~~
