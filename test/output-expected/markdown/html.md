GIVEN an html link THEN <a href="../glossary.md" title="">Lorem ipsum</a> MAY be linked to glossary.
GIVEN an html attribute THEN <a href="dolor">term</a> MAY be linked to glossary.
GIVEN html THEN <p><em>Lorem ipsum</em></p> MAY be linked.
GIVEN broken html THEN <p><em>Lorem ipsum</p> MAY be linked.

<!-- Begin Scenario-->

GIVEN html across multiple paragraphs<p>

THEN "[Lorem ipsum↴][1]"

</p>MAY be linked.
<!-- End Scenario-->

[1]: ./glossary.md#lorem-ipsum "Lorem ipsum is the worlds most famous, most beloved piece of nonsense."
