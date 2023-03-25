# [Glossary](#glossary)

## [Imported Term 1](#imported-term-1)

<!--{
  "uri": "/#1",
  "aliases": "Alias 1.1,Alias 1.2,Alias 1.3"
}-->

GIVEN a skos:definition WITH NOT quoted text data AND 'quoteChar' (default) being the quote character AND 'escapeChar' (default) being the quote character, too, THEN the CSV text data MAY NOT be surrounded by 'quoteChar' AND NO quote chars within the text data MUST be escaped by 'escapeChar' AND the glossary term definition output MUST NOT be surrounded by 'quoteChar' AND MUST NOT be escaped with 'escapeChar' AND MUST be equal to this definition.

## [Imported Term 2](#imported-term-2)

<!--{
  "uri": "/#2",
  "aliases": "Alias 2.1,Alias 2.2,Alias 2.3"
}-->

GIVEN a skos:definition WITH "quoted text data" AND 'quoteChar' (default) being the quote character AND 'escapeChar' (default) being the quote character, too, THEN the CSV text data MUST be surrounded by 'quoteChar' AND quote chars within the text data MUST be escaped by 'escapeChar' AND the glossary term definition output MUST NOT be surrounded by 'quoteChar' anymore AND MUST NOT be escaped with 'escapeChar' anymore AND MUST be similar to 'quoted text data' except of the single quotes being quotes.

## [Imported Term 3](#imported-term-3)

<!--{
  "uri": "/#3",
  "aliases": "Alias 3.1,Alias 3.2,Alias 3.3"
}-->

GIVEN a skos:definition WITH "quoted text data embedding more "quoted text data"" AND 'quoteChar' (default) being the quote character AND 'escapeChar' (default) being the quote character, too, THEN the CSV text data MUST be surrounded by 'quoteChar' AND quote chars within the text data MUST be escaped by 'escapeChar' AND the glossary term definition output MUST NOT be surrounded by 'quoteChar' anymore AND MUST NOT be escaped with 'escapeChar' anymore AND MUST be similar to 'quoted text data embedding more 'quoted text data'' except of the single quotes being quotes.
