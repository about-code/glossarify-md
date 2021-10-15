# Glossary

GIVEN a glossary
AND no glossary URI
AND option `headingIdAlgorithm: 'md5-7'`
...

## Term

... AND a single term
THEN the system must generate an URI term://127.0.0.1/#{hash}

## Phrase with Spaces

...AND a phrase with spaces
THEN the system must generate an URI term://127.0.0.1/#{hash}
