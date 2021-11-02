# Document

GIVEN
- a configuration

  ~~~json
  {
    "glossaries": [{
      "file": "./glossary.md",
      "export": {
        "file": "./glossary.nq"
      }
    }]
  }
  ~~~

- AND [jsonld](https://npmjs.com/package/jsonld) npm package being installed
- AND a glossary `glossary.md`
- AND NO glossary `uri`
- AND `glossary.md` to be exported to a file `glossary.nq` using `export`

THEN

- glossarify-md MUST NOT write data to a file `glossary.nq`
- AND glossarify-md MUST print a console message informing about the missing URI.
