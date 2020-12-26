# Testing Term Definition Extraction

## Single sentence terminated by full stop

GIVEN a single sentence terminated by a fullstop THEN short description AND long description MUST be the same.

## Single sentence terminated by question mark

GIVEN a single sentence terminated by a question mark THEN short description AND long description MUST be the same?

## Single sentence terminated by exclamation mark

GIVEN a single sentence terminated by an exclamation mark THEN short description AND long description MUST be the same!

## Two sentences in a single line terminated by full stop

GIVEN two sentences terminated by fullstop THEN short description MUST be the first sentence. AND long description MUST be the first and second sentence.

## Single sentence across multiple lines

GIVEN a single sentence across multiple lines
THEN short description must be extracted correctly
AND long description MUST be the same.

## Two sentences in multiple lines terminated by full stop

GIVEN two sentences terminated by fullstop THEN short description MUST be the first sentence.
AND long description MUST be the first and second sentence.

## Two sentences across multiple lines terminated by full stop

GIVEN two sentences terminated by fullstop THEN short description MUST be the
first sentence. AND long description MUST be the first and
second sentence.

## Formatted Term Definitions

### GIVEN short description is a blockquote

> THEN short description MUST be detected completely.

AND long description MUST be complete, too.

### GIVEN long description is a blockquote

THEN short description MUST be detected completely.

> AND long description MUST be complete, too.

### GIVEN full description is a blockquote

> THEN short description MUST be detected completely. AND long description MUST be complete, too.

### GIVEN short description is italic WITH fullstop included

*THEN short description MUST be detected completely.* AND long description MUST be complete, too.

### GIVEN short description is italic WITH fullstop excluded

*THEN short description MUST be detected completely*. AND long description MUST be complete, too.

### GIVEN short description is bold WITH fullstop included

**THEN short description MUST be detected completely.** AND long description MUST be complete, too.

### GIVEN short description is bold WITH fullstop excluded

**THEN short description MUST be detected completely**. AND long description MUST be complete, too.

### GIVEN short description has a link

THEN short description with a [link](./foo.md) MUST be detected completely. AND long description MUST be complete, too.

### GIVEN long description has a link

THEN short description MUST be detected completely. AND long description with a [link](./foo.md) MUST be complete, too.

### Description Partly Formatted

GIVEN short description `partly formatted`. AND long description being partly `formatted`, too.
THEN short AND long description MUST still be extracted, correctly.
