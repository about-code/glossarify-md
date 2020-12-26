# [Glossary with markdown formatted term](#glossary-with-markdown-formatted-term)

## [`codespan-format`](#codespan-format)

GIVEN a term heading being `codespan` formatted
THEN term occurrences in the document must still be linked, correctly

## [*italic-format*](#italic-format)

GIVEN a term heading being *italic* formatted
THEN term occurrences in the document must still be linked, correctly

## [**bold-format**](#bold-format)

GIVEN a term heading being **bold** formatted
THEN term occurrences in the document must still be linked, correctly

## [In parts `formatted`](#in-parts-formatted)

Given a term heading being in parts formatted
THEN occurrences of the whole phrase in the document must still be linked, correctly

## [*dense-definition*](#dense-definition)

GIVEN a term heading being formatted
AND being followed by a description without an intermediate empty line.
THEN term, short and long description MUST still be extracted, correctly.

## [*dense-definition-with-alias*](#dense-definition-with-alias)

<!-- Aliases: dense-with-alias-->

GIVEN a term heading being formatted
AND being followed by HTML aliases
AND being followed by a description all without an intermediate empty line.
THEN term, aliases, short and long description MUST still be extracted, correctly.

## [#Hashtag](#hashtag)

GIVEN a term definition with a hashtag
THEN term occurrences in the document must still be linked, correctly
