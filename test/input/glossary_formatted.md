# Formatted Term Definitions

## GIVEN short description is a blockquote

> THEN short description MUST be detected completely.

AND long description MUST be complete, too.

## GIVEN long description is a blockquote

THEN short description MUST be detected completely.

> AND long description MUST be complete, too.

## GIVEN full description is a blockquote

> THEN short description MUST be detected completely. AND long description MUST be complete, too.

## GIVEN short description is italic WITH fullstop included

*THEN short description MUST be detected completely.* AND long description MUST be complete, too.

## GIVEN short description is italic WITH fullstop excluded

*THEN short description MUST be detected completely*. AND long description MUST be complete, too.

## GIVEN short description is bold WITH fullstop included

**THEN short description MUST be detected completely.** AND long description MUST be complete, too.

## GIVEN short description is bold WITH fullstop excluded

**THEN short description MUST be detected completely**. AND long description MUST be complete, too.

## GIVEN short description has a link

THEN short description with a [link](./foo.md) MUST be detected completely. AND long description MUST be complete, too.

## GIVEN long description has a link

THEN short description MUST be detected completely. AND long description with a [link](./foo.md) MUST be complete, too.
