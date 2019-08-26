WHEN in an html link THEN <a href="../glossary.md" title="">Lorem ipsum</a> MAY be linked to glossary.
WHEN in an html attribute THEN <a href="dolor">term</a> MAY be linked to glossary.
WHEN in html THEN <p><em>Lorem ipsum</em></p> MAY be linked.
WHEN in broken html THEN <p><em>Lorem ipsum</p> MAY be linked.

<!-- Begin Scenario-->
WHEN in html accross multiple paragraphs<p>

THEN "Lorem ipsum"

</p>MAY be linked.
<!-- End Scenario-->

