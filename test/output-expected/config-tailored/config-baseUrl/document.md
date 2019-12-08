# [Testing option 'baseUrl' with option 'linking = absolute'][1]

GIVEN baseUrl is `http://example.org` AND linking is 'absolute' THEN '[Term1][2]'
from glossary.md MUST be replaced with a link to `http://example.org#Term1`.

GIVEN baseUrl is `http://example.org` AND linking is 'absoulte' THEN '[Term2][3]'
from ./sub-1/glossary.md MUST be replaced with a link to
`http://example.org/sub-1#Term2`.

[1]: #testing-option-baseurl-with-option-linking--absolute

[2]: http://example.org/glossary.md#term1

[3]: http://example.org/sub-1/glossary.md#term2
