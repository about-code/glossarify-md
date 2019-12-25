GIVEN term is a link label THEN [Lorem ipsum][1] MUST NOT be linked to glossary.

GIVEN term is an image link label ![Lorem ipsum][2] MUST NOT be linked to glossary.

GIVEN term is part of a [link target url][3] THEN term MUST NOT be linked to glossary.

GIVEN term is part of an ![image link target url][3] THEN term MUST NOT be linked to glossary.

GIVEN term is a reference link label THEN [Lorem ipsum][100] MUST NOT be linked to glossary.

GIVEN term is in braces THEN ([Lorem ipsum↴][4]) MUST be linked.

[100]: ./test.html

[1]: ./Headline.md

[2]: ./Headline

[3]: dolor.md

[4]: glossary.md#lorem-ipsum "Lorem ipsum is the worlds most famous, most beloved piece of nonsense."
