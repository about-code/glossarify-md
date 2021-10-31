# Document

GIVEN `unsafe-*.json` files to import
WITH files having unsafe HTML and Markdown syntax
THEN the system MUST remove any HTML and Markdown syntax from generated `safe-*.md` glossaries
EXCEPT Markdown syntax which is part of glossarify-md's glossary template itself.
