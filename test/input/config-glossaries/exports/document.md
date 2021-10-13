# Document

GIVEN a configuration

~~~json
{
  "glossaries": [{
    "uri": "https://my.org/vocabulary/#",
    "file": "./glossary-1.md",
    "exports": [{
      "file": "./glossary-1-export-1.json"
    },{
      "file": "./glossary-1-export-2.json"
      ,"context": "./custom.jsonld"
    }]
  },{
    "file": "./glossary-2.md"
  }],
}
~~~

WITH two glossaries `glossary-1.md` and `glossary-2.md`

- AND WITH `glossary-2.md` NOT to be exported to a file
- AND WITH `glossary-1.md` to be exported to *two* files `glossary-1-export-1.json` and `glossary-1-export-2.json`
- AND with `glossary-1-export-2.json` requiring embedding of an external JSON-LD context document `./custom.jsonld`

THEN glossarify-md MUST write two files `glossary-1-export-1.json` AND `glossary-1-export-2.json`

- AND every term URI in these files MUST be prefixed with the URI of the glossary
- AND `glossary-1-export-2.json` MUST have got embedded `custom.jsonld`
