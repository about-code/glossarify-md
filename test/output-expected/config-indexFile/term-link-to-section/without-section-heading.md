GIVEN a term '[Term][1]'
AND a document without a heading
AND the term is mentioned in the document
THEN in the index the term MUST be linked with a path './without-section-heading.md'
AND a link label with the path './without-section-heading.md' instead of a section title.

[1]: ./glossary.md#term "GIVEN a term 'Term'
AND a document with a heading 'Section'
AND the term is mentioned in that section
THEN in the index the term MUST be linked with a path './with-section-heading.md#section'
AND a link label 'Section'."
