GIVEN term is a link label THEN [Lorem ipsum][1] MUST NOT be linked to glossary.

GIVEN term is an image link label ![Lorem ipsum][2] MUST NOT be linked to glossary.

GIVEN term is part of a [link target url][3] THEN term MUST NOT be linked to glossary.

GIVEN term is part of an ![image link target url][3] THEN term MUST NOT be linked to glossary.

[1]: ./Headline.md

[2]: ./Headline

[3]: dolor.md
