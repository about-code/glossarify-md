# [Export to N-Quads](#export-to-n-quads)

## [Simple](#simple)

GIVEN a simple term with two sentences.
THEN this second sentence MUST only be part of SKOS `definition`
AND MUST NOT be part of Dublin Core `abstract`.

## [Aliased](#aliased)

<!-- Aliases: Alias-1, Alias-2 -->

GIVEN a term with aliases
THEN this term MUST be exported with all its aliases as SKOS `altLabel`.

## [Custom-URI](#custom-uri)

<!--{
  "uri": "https://other.org/vocab/#custom-uri"
}-->

GIVEN a term with a `uri` term attribute
THEN this term MUST be exported using uri [https://other.org/vocab/#custom-uri][1].

[1]: https://other.org/vocab/#custom-uri
