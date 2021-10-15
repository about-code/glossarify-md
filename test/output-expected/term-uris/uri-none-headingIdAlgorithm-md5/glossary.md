# [Glossary](#md5:17d8aa2)

GIVEN a glossary
AND no glossary URI
AND option `headingIdAlgorithm: 'md5-7'`
...

## [Term](#md5:8b3b1b8)

... AND a single term
THEN the system must generate an URI term://127.0.0.1/#{hash}

## [Phrase with Spaces](#md5:da83c5a)

...AND a phrase with spaces
THEN the system must generate an URI term://127.0.0.1/#{hash}
