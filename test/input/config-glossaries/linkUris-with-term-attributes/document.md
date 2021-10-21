# Document

GIVEN a configuration

~~~json
{
  "glossaries": [
    {
      "file": "./glossary*.md",
      "linkUris": true
    }
  ]
}
~~~
WITH a glob pattern `./glossary*.md` AND option `linkUris: true`
AND NOT WITH glossary URI using option `uri`
AND glossaries
  - `glossary-1.md`
     - WITH a term *Foo*
       - WITH a term attribute `<!--{ "uri": "https://foo.vocab/#foo" }-->`
  - `glossary-2.md`
     - WITH a term *Bar*
       - WITH a term attribute `<!--{ "uri": "https://bar.vocab/#bar" }-->`
     - WITH a term *Baz*
       - NOT WITH at term attribute
AND this document mentioning the terms
THEN the system MUST linkify

1. term *Foo* using URL `https://foo.vocab/#foo`
2. term *Bar* using URL `https://bar.vocab/#bar`
3. term *Baz* using a relative reference `glossary-2.md#baz` (see also RFC 3986)
