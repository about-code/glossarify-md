# [Glossary](#glossary)

## [Imported Term 1](#imported-term-1)

<!--{
  "uri": "/#1",
  "aliases": "Alias 1.1,Alias 1.2,Alias 1.3"
}-->

GIVEN an '@id' field WITH text data containing a hash AND a skos:definition field NOT WITH quoted text data AND 'quoteChar' (custom) being the hash character AND 'escapeChar' (custom) being the backslash character THEN in CSV input the '@id' field value MUST be surrounded by 'quoteChar' (hash) AND its hash text data MUST be escaped by 'escapeChar' (backslash) AND skos:definition text data is NOT required to be surrounded by 'quoteChar' AND NOT required to be escaped with 'escapeChar' AND the output glossary term MUST have this record's term URI with one hash preceeding the ID number AND a term definition being equal to this definition.

## [Imported Term 2](#imported-term-2)

<!--{
  "uri": "/#2",
  "aliases": "Alias 2.1,Alias 2.2,Alias 2.3"
}-->

GIVEN an '@id' field WITH text data containing a hash AND a skos:definition field WITH "quoted text data" AND 'quoteChar' (custom) being the hash character AND 'escapeChar' (custom) being the backslash character THEN in CSV input the '@id' field value MUST be surrounded by 'quoteChar' (hash) AND its hash text data MUST be escaped by 'escapeChar' (backslash) AND skos:definition text data is NOT required to be surrounded by 'quoteChar' AND NOT required to be escaped with 'escapeChar' AND the output glossary term MUST have this record's term URI with one hash preceeding the ID number AND a term definition being equal to this definition.

## [Imported Term 3](#imported-term-3)

<!--{
  "uri": "/#3",
  "aliases": "Alias 3.1,Alias 3.2,Alias 3.3"
}-->

GIVEN an '@id' field with text data containing a hash AND a skos:definition field WITH "quoted text data embedding more "quoted text data"" AND 'quoteChar' (custom) being the hash character AND 'escapeChar' (custom) being the backslash character THEN in CSV the '@id' field value MUST be surrounded by 'quoteChar' (hash) AND its hash text data MUST be escaped by 'escapeChar' (backslash) AND skos:definition text data is NOT required to be surrounded by 'quoteChar' AND NOT to be escaped with 'escapeChar' AND the output glossary term MUST have have this record's URI with one hash preceeding the ID number AND a term definition being equal to this definition.
