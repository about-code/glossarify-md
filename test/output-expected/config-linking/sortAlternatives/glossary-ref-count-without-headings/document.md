GIVEN

*   a configuration...
    ```json
    {
      "glossaries": [{
        "file": "./glossary-*.md"
      }],
      "linking": {
        "sortAlternatives":{
          "by": "glossary-ref-count",
          "perSectionDepth": 2
        }
      }
    }
    ```
*   AND a term <em>Shared All</em> defined in all glossaries
*   AND a distinct term per glossary
*   **AND no section headings**
*   AND term occurrences
    *   [Shared All][1][<sup>2)</sup>][2][<sup> 3)</sup>][3]
    *   [Only A][4]
    *   [Only B][5], [Shared AB][6][<sup>2)</sup>][7], [Shared BC][8][<sup>2)</sup>][9]

THEN term occurrence <em>Shared All</em> MUST be linked to glossary definitions in order BAC which is the order derived from a glossary reference count distribution

    refCount
        ^
      4_|   _
      3_|  | |  _
      2_|  | | | |  _
      1_|  | | | | | |
      0_|  |4| |3| |2|
        +-|---|---|---|---> Glossary
          | B | A | C |

[1]: ./glossary-b.md#shared-all "Glossary B"

[2]: ./glossary-a.md#shared-all "Glossary A"

[3]: ./glossary-c.md#shared-all "Glossary C"

[4]: ./glossary-a.md#only-a "defined in glossary A, only."

[5]: ./glossary-b.md#only-b "defined in glossary B, only."

[6]: ./glossary-b.md#shared-ab "defined in glossary B and A."

[7]: ./glossary-a.md#shared-ab "defined in glossary A and B."

[8]: ./glossary-b.md#shared-bc "defined in glossary B and C."

[9]: ./glossary-c.md#shared-bc "defined in Glossary C and B."
