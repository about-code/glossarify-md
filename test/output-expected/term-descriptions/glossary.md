# [Testing Term Definition Extraction](#testing-term-definition-extraction)

## [Single sentence terminated by full stop](#single-sentence-terminated-by-full-stop)

GIVEN a single sentence terminated by a fullstop THEN short description AND long description MUST be the same.

## [Single sentence terminated by question mark](#single-sentence-terminated-by-question-mark)

GIVEN a single sentence terminated by a question mark THEN short description AND long description MUST be the same?

## [Single sentence terminated by exclamation mark](#single-sentence-terminated-by-exclamation-mark)

GIVEN a single sentence terminated by an exclamation mark THEN short description AND long description MUST be the same!

## [Two sentences in a single line terminated by full stop](#two-sentences-in-a-single-line-terminated-by-full-stop)

GIVEN two sentences terminated by fullstop THEN short description MUST be the first sentence. AND long description MUST be the first and second sentence.

## [Single sentence accross multiple lines](#single-sentence-accross-multiple-lines)

GIVEN a single sentence accross multiple lines
THEN short description must be extracted correctly
AND long description MUST be the same.

## [Two sentences in multiple lines terminated by full stop](#two-sentences-in-multiple-lines-terminated-by-full-stop)

GIVEN two sentences terminated by fullstop THEN short description MUST be the first sentence.
AND long description MUST be the first and second sentence.

## [Two sentences accross multiple lines terminated by full stop](#two-sentences-accross-multiple-lines-terminated-by-full-stop)

GIVEN two sentences terminated by fullstop THEN short description MUST be the
first sentence. AND long description MUST be the first and
second sentence.

## [Formatted Term Definitions](#formatted-term-definitions)

### [GIVEN short description is a blockquote](#given-short-description-is-a-blockquote)

> THEN short description MUST be detected completely.

AND long description MUST be complete, too.

### [GIVEN long description is a blockquote](#given-long-description-is-a-blockquote)

THEN short description MUST be detected completely.

> AND long description MUST be complete, too.

### [GIVEN full description is a blockquote](#given-full-description-is-a-blockquote)

> THEN short description MUST be detected completely. AND long description MUST be complete, too.

### [GIVEN short description is italic WITH fullstop included](#given-short-description-is-italic-with-fullstop-included)

*THEN short description MUST be detected completely.* AND long description MUST be complete, too.

### [GIVEN short description is italic WITH fullstop excluded](#given-short-description-is-italic-with-fullstop-excluded)

*THEN short description MUST be detected completely*. AND long description MUST be complete, too.

### [GIVEN short description is bold WITH fullstop included](#given-short-description-is-bold-with-fullstop-included)

**THEN short description MUST be detected completely.** AND long description MUST be complete, too.

### [GIVEN short description is bold WITH fullstop excluded](#given-short-description-is-bold-with-fullstop-excluded)

**THEN short description MUST be detected completely**. AND long description MUST be complete, too.

### [GIVEN short description has a link](#given-short-description-has-a-link)

THEN short description with a [link][1] MUST be detected completely. AND long description MUST be complete, too.

### [GIVEN long description has a link](#given-long-description-has-a-link)

THEN short description MUST be detected completely. AND long description with a [link][1] MUST be complete, too.

### [Description Partly Formatted](#description-partly-formatted)

GIVEN short description `partly formatted`. AND long description being partly `formatted`, too.
THEN short AND long description MUST still be extracted, correctly.

[1]: ./foo.md
