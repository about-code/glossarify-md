GIVEN term is a link label THEN [Lorem ipsum](./Headline.md) MUST NOT be linked to glossary.

GIVEN term is an image link label ![Lorem ipsum](./Headline) MUST NOT be linked to glossary.

GIVEN term is part of a [link target url](dolor.md) THEN term MUST NOT be linked to glossary.

GIVEN term is part of an ![image link target url](dolor.md) THEN term MUST NOT be linked to glossary.
