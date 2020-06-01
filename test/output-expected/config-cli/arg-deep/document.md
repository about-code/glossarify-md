GIVEN command line

-   `--config "./glossarify-md.conf.json"`
-   `--deep "{ 'baseUrl':'cli://localhost', 'linking':'absolute', 'glossaries':[{'file': './glossary2.md'}]}"`

AND a config file:

_./glossarify-md.conf.json_

```json
{
    "$schema": "../../../../conf.schema.json",
    "baseUrl": "file://localhost",
    "baseDir": ".",
    "outDir": "../../../output-actual/config-cli/arg-shallow",
    "includeFiles": ["."],
    "glossaries": [
        { "file": "./glossary.md"}
    ],
    "linking": "relative"
}
```

WITH

-   options `baseDir` and `outDir` not present on the command-line

AND

-   options `baseUrl` and `linking` and `glossaries` present on the command-line _AND_ in the config-file

THEN

-   options `baseDir` and `outDir` MUST be read **from the config file**

AND

-   options `baseUrl` and `linking` MUST be read **from the command-line**

AND (

-   options `glossaries` MUST be **merged**
-   the term '[Term][1][<sup>1)</sup>][1][<sup> 2)</sup>][2]' MUST be linked absolutely to
    -   `cli://localhost/glossary.md#term`
    -   `cli://localhost/glossary2.md#term`

)

[1]: ./glossary.md#term

[2]: ./glossary2.md#term
