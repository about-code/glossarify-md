# Document

GIVEN

- a configuration

  ~~~json
  {
    "glossaries": [{
      "uri": "https://my.org/vocabulary/#",
      "file": "./glossary.md",
      "export": { "file": "./glossary.nq" }
    },{
      "file": "./glossary-2.md"
    }]
  }
  ~~~

- AND two glossaries `glossary.md` and `glossary-2.md`
  - WITH `glossary.md` to be exported to a file `glossary.nq` using `export`
  - AND `glossary-2.md` NOT to be exported to a file due to NOT using `export`
- AND [jsonld](https://npmjs.com/package/jsonld) npm package being installed

THEN glossarify-md MUST write a file `glossary.nq` to the output folder

- AND every term URI in `glossary.nq` MUST be prefixed with the URI of the glossary
- AND glossarify-md MUST NOT run into errors when processing `glossary-2.md`.
