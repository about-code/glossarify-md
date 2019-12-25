GIVEN an html link THEN <a href="../glossary.md" title="">Lorem ipsum</a> MAY be linked to glossary.
GIVEN an html attribute THEN <a href="dolor">term</a> MAY be linked to glossary.
GIVEN html THEN <p><em>Lorem ipsum</em></p> MAY be linked.
GIVEN broken html THEN <p><em>Lorem ipsum</p> MAY be linked.

<!-- Begin Scenario-->
GIVEN html accross multiple paragraphs<p>

THEN "Lorem ipsum"

</p>MAY be linked.
<!-- End Scenario-->

