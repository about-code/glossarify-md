# Testing option 'baseUrl' with option 'linking = absolute'

WHEN baseUrl is `http://example.org` AND linking is 'absolute' THEN 'Term1'
from glossary.md MUST be replaced with a link to `http://example.org#Term1`.

WHEN baseUrl is `http://example.org` AND linking is 'absoulte' THEN 'Term2'
from ./sub-1/glossary.md MUST be replaced with a link to
`http://example.org/sub-1#Term2`.
