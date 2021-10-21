# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "uri": "https://my.org/vocabulary/#",
    "file": "./glossary.md",
    "export": { "file": "./glossary.json" }
  },{
    "file": "./glossary-2.md"
  }],
}
~~~

WITH two glossaries `glossary.md` and `glossary-2.md`

- AND WITH `glossary.md` to be exported to a file `glossary.json` using `export`
- AND WITH `glossary-2.md` NOT to be exported to a file due to NOT using `export`

THEN glossarify-md MUST write a file `glossary.json` to the output folder

- AND every term URI in `glossary.json` MUST be prefixed with the URI of the glossary
- AND glossarify-md MUST NOT run into errors when processing `glossary-2.md`.
