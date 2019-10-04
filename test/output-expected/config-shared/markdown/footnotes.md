# Markdown Extensions: Footnotes

<!--
Footnotes are not yet part of CommonMark Spec
under spec.commonmark.org
-->

GIVEN option `experimentalFootnotes: true`
AND text with a footnote [^footnote]
THEN colons of the footnote definition prior to 'Footnote text' MUST NOT be converted to HTML entities.

[^footnote]: Footnote text.
