# Testing exporting multiple glossaries matched by glob.

GIVEN

- a configuration

  ~~~json
  {
    "glossaries": [
      {
        "uri": "https://my.org/vocab/inc/#",
        "export": { "file": "./inc.json" },
        "file": "./glossary-inc*.md"
      },
      {
        "uri": "https://my.org/vocab/include/#",
        "export": { "file": "./include.json" },
        "file": "./glossary-include*.md"
      },
      {
        "uri": "https://my.org/vocab/exclude/#",
        "file": "./glossary-exclude.md"
      }
    ],
  }
  ~~~

- AND five glossaries

  - [glossary-exclude.md](./glossary-exclude.md)
  - [glossary-inc-1.md](./glossary-inc-1.md)
  - [glossary-inc-2.md](./glossary-inc-2.md)
  - [glossary-include-1.md](./glossary-include-1.md)
  - [glossary-include-2.md](./glossary-include-2.md)

- AND glob pattern `./glossary-inc*` matching

  - [glossary-inc-1.md](./glossary-inc-1.md)
  - [glossary-inc-2.md](./glossary-inc-2.md)
  - [glossary-include-1.md](./glossary-include-1.md)
  - [glossary-include-2.md](./glossary-include-2.md)

- AND glob pattern `./glossary-include*` matching

  - [glossary-include-1.md](./glossary-include-1.md)
  - [glossary-include-2.md](./glossary-include-2.md)

- AND `glossaries` entry for glob pattern `./glossary-include*` taking priority over `./glossary-inc*`

THEN

- the system MUST write terms to export files
  - [glossary-exclude.md](./glossary-exclude.md) -> NONE
  - [glossary-inc-1.md](./glossary-inc-1.md) -> [inc.json](./inc.json)
  - [glossary-inc-2.md](./glossary-inc-2.md) -> [inc.json](./inc.json)
  - [glossary-include-1.md](./glossary-include-1.md) -> [include.json](./include.json)
  - [glossary-include-2.md](./glossary-include-2.md) -> [include.json](./include.json)
- AND [inc.json](./inc.json)
  - MUST have glossary title *Inc (1)*
  - AND MUST have URI https://my.org/vocab/inc/#
  - AND MUST have ALL of these terms
    - https://my.org/vocab/inc/#glossary (`glossary-inc-1.md`)
    - https://my.org/vocab/inc/#taxonomy (`glossary-inc-1.md`)
    - https://my.org/vocab/inc/#thesaurus (`glossary-inc-1.md`)
    - https://my.org/vocab/inc/#ontology (`glossary-inc-2.md`)
- AND [include.json](./include.json) MUST
  - MUST have glossary title  *Include (1)*
  - AND MUST have URI https://my.org/vocab/include/#
  - AND MUST have ALL of these terms
    - https://my.org/vocab/include/#car (`glossary-include-1.md`)
    - https://my.org/vocab/include/#bobby-car (`glossary-include-2.md`)
