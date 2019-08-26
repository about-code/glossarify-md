WHEN in a link label THEN [Lorem ipsum](./Headline.md) MUST NOT be linked to glossary.

WHEN in a image link label ![Lorem ipsum](./Headline) MUST NOT be linked to glossary.

WHEN as a [link target](dolor.md) THEN term MUST NOT be linked to glossary.

WHEN as an ![image link target](dolor.md) THEN term MUST NOT be linked to glossary.

WHEN in an html link THEN <a href="../glossary.md" title="">Lorem ipsum</a> MUST NOT be linked to glossary.

WHEN in an html attribute THEN <a href="dolor">term</a> MUST NOT be linked to glossary.
