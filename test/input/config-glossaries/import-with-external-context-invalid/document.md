# Document

GIVEN

- a configuration

  ~~~json
  {
  "glossaries": [{
      "file": "imported.md",
      "import": {
      "file": "./glossary-with-invalid-context.json"
      }
  }]
  }
  ~~~

- AND a file `./glossary-with-invalid-context.json` WITH an invalid JSON-LD `@context`

THEN

1. the system MUST print the `jsonld` parser error message to `console`
1. AND the system MUST NOT print the stack trace to `console`
1. AND the system MUST print the errorneous context document to `console`.
