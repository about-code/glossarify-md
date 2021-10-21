# Document

GIVEN a configuration

~~~json
{
  "glossaries": [
    {
      "uri": "https://my.org/vocab/#",
      "file": "./glossary.md",
      "linkUris": true
    }
  ]
}
~~~
WITH option `linkUris: true`
AND a glossary with a term *Foo*
AND this document mentioning the term
THEN the system MUST linkify the term
AND the link URL must be the URI `https://my.org/vocab/#foo`
