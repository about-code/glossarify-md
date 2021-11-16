# Document

GIVEN

- a configuration

  ~~~json
  {
    "glossaries": [{
      "uri": "#",
      "file": "./glossary.md",
      "export": { "file": "./glossary.json" }
    }]
  }
  ~~~

- AND a glossary `glossary.md`
  - WITH `uri: "#"` NOT being a WHATWG URL
  - AND WITH `glossary.md` to be exported to a file `glossary.json` using `export`
  - AND terms
    - Glossary
    - Taxonomy
    - Thesaurus

THEN glossarify-md MUST write a file `glossary.json` to the output folder

- AND every term URI in `glossary.json` MUST be prefixed with the URI of the glossary
