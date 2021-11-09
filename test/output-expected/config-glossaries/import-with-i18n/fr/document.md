# [Document (FR)](#document-fr)

GIVEN

*   a configuration
    ```json
    "glossaries":[{
        "file": "./glossary-fr.md",
        "import": {
          "file": "./eurovoc.europa.eu.json"
        }
    }],
    "i18n": {
      "locale": "fr"
    }
    ```
*   WITH `i18n.locale: "fr"`
*   AND a JSON-LD import for a term data from vocabulary [http://eurovoc.europa.eu][1]
    *   WITH `skos:ConceptScheme` not having a `dc:title` but a `skos:prefLabel`
    *   AND `skos:Concept` entries and `skos:prefLabel` in multiple languages
    *   AND a format different from glossarify-md's own export format
    *   AND original data having been reduced to some languages, only
        without limitations to expressivity of the test

THEN

1.  the system MUST create a file `glossary-fr.md`
2.  AND the file SHOULD have a heading `EuroVoc` matching `skos:prefLabel` of the first `skos:ConceptScheme`
3.  AND the file MUST only have vocabulary terms matching locale `fr`
4.  AND the file MUST NOT have `aliases` from `skos:altLabel`s in another locale.

See also:

*   [https://skosmos.dev.finto.fi/rest/v1/euro/data?uri=http%3A%2F%2Feurovoc.europa.eu%2F5482\&format=application/ld%2Bjson][2]
*   [https://skosmos.dev.finto.fi/euro/en/][3]

[1]: http://eurovoc.europa.eu

[2]: https://skosmos.dev.finto.fi/rest/v1/euro/data?uri=http%3A%2F%2Feurovoc.europa.eu%2F5482&format=application/ld%2Bjson

[3]: https://skosmos.dev.finto.fi/euro/en/
