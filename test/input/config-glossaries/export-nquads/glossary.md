# Export to N-Quads

## Simple

GIVEN a simple term with two sentences.
THEN this second sentence MUST only be part of SKOS `definition`
AND MUST NOT be part of Dublin Core `abstract`.


## Aliased
<!-- Aliases: Alias-1, Alias-2 -->

GIVEN a term with aliases
THEN this term MUST be exported with all its aliases as SKOS `altLabel`.

## Custom-URI
<!--{
  "uri": "https://other.org/vocab/#custom-uri"
}-->

GIVEN a term with a `uri` term attribute
THEN this term MUST be exported using uri https://other.org/vocab/#custom-uri.
