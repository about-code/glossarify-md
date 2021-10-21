# [Testing exporting multiple glossaries matched by glob.](#testing-exporting-multiple-glossaries-matched-by-glob)

GIVEN

*   a configuration

    ```json
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
    ```

*   AND five glossaries

    *   [glossary-exclude.md][1]
    *   [glossary-inc-1.md][2]
    *   [glossary-inc-2.md][3]
    *   [glossary-include-1.md][4]
    *   [glossary-include-2.md][5]

*   AND glob pattern `./glossary-inc*` matching

    *   [glossary-inc-1.md][2]
    *   [glossary-inc-2.md][3]
    *   [glossary-include-1.md][4]
    *   [glossary-include-2.md][5]

*   AND glob pattern `./glossary-include*` matching

    *   [glossary-include-1.md][4]
    *   [glossary-include-2.md][5]

*   AND `glossaries` entry for glob pattern `./glossary-include*` taking priority over `./glossary-inc*`

THEN

*   the system MUST write terms to export files
    *   [glossary-exclude.md][1] -> NONE
    *   [glossary-inc-1.md][2] -> [inc.json][6]
    *   [glossary-inc-2.md][3] -> [inc.json][6]
    *   [glossary-include-1.md][4] -> [include.json][7]
    *   [glossary-include-2.md][5] -> [include.json][7]
*   AND [inc.json][6]
    *   MUST have glossary title *Inc (1)*
    *   AND MUST have URI [https://my.org/vocab/inc/#][8]
    *   AND MUST have ALL of these terms
        *   [https://my.org/vocab/inc/#glossary][9]
        *   [https://my.org/vocab/inc/#taxonomy][10]
        *   [https://my.org/vocab/inc/#thesaurus][11]
        *   [https://my.org/vocab/inc/#ontology][12]
*   AND [include.json][7] MUST
    *   MUST have glossary title  *Include (1)*
    *   AND MUST have URI [https://my.org/vocab/include/#][13]
    *   AND MUST have ALL of these terms
        *   [https://my.org/vocab/include/#car][14]
        *   [https://my.org/vocab/include/#bobby-car][15]

[1]: ./glossary-exclude.md

[2]: ./glossary-inc-1.md

[3]: ./glossary-inc-2.md

[4]: ./glossary-include-1.md

[5]: ./glossary-include-2.md

[6]: ./inc.json

[7]: ./include.json

[8]: https://my.org/vocab/inc/#

[9]: https://my.org/vocab/inc/#glossary

[10]: https://my.org/vocab/inc/#taxonomy

[11]: https://my.org/vocab/inc/#thesaurus

[12]: https://my.org/vocab/inc/#ontology

[13]: https://my.org/vocab/include/#

[14]: https://my.org/vocab/include/#car

[15]: https://my.org/vocab/include/#bobby-car
