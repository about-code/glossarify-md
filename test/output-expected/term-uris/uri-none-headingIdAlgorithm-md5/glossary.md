# [Glossary](#md5-355f756)

GIVEN a glossary
AND no glossary URI
AND option `headingIdAlgorithm: 'md5-7'`
...

## [Term](#md5-7e9dfa8)

... AND a single term
THEN the system must generate an URI term://127.0.0.1/#{hash}

## [Phrase with Spaces](#md5-08780c0)

...AND a phrase with spaces
THEN the system must generate an URI term://127.0.0.1/#{hash}
