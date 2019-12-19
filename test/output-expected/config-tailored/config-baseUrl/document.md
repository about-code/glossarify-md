# [Testing option 'baseUrl' with option 'linking = absolute'](#testing-option-baseurl-with-option-linking--absolute)

GIVEN baseUrl is `http://example.org` AND linking is 'absolute' THEN '[Term1][1]'
from glossary.md MUST be replaced with a link to `http://example.org#Term1`.

GIVEN baseUrl is `http://example.org` AND linking is 'absoulte' THEN '[Term2][2]'
from ./sub-1/glossary.md MUST be replaced with a link to
`http://example.org/sub-1#Term2`.

[1]: http://example.org/glossary.md#term1

[2]: http://example.org/sub-1/glossary.md#term2
