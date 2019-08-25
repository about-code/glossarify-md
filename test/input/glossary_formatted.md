## WHEN short description is a blockquote

> THEN short description MUST be detected completely.

AND long description MUST be complete, too.

## WHEN long description is a blockquote

THEN short description MUST be detected completely.

> AND long description MUST be complete, too.

## WHEN full description is a blockquote

> THEN short description MUST be detected completely. AND long description MUST be complete, too.

## WHEN short description is italic WITH fullstop included

*THEN short description MUST be detected completely.* AND long description MUST be complete, too.

## WHEN short description is italic WITH fullstop excluded

*THEN short description MUST be detected completely*. AND long description MUST be complete, too.

## WHEN short description is bold WITH fullstop included

**THEN short description MUST be detected completely.** AND long description MUST be complete, too.

## WHEN short description is bold WITH fullstop excluded

**THEN short description MUST be detected completely**. AND long description MUST be complete, too.

## WHEN short description has a link

THEN short description with a [link](./foo.md) MUST be detected completely. AND long description MUST be complete, too.

## WHEN long description has a link

THEN short description MUST be detected completely. AND long description with a [link](./foo.md) MUST be complete, too.
