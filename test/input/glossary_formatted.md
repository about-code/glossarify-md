# Formatted Term Definitions

## WHEN short description is a blockquote

> THEN short description in blockquote MUST be detected.

AND long description, too.

## WHEN long description is a blockquote

THEN short description MUST be detected.

> AND long description, too.

## WHEN full description is a blockquote

> THEN short description MUST be detected. AND long description, too.


## WHEN short description is italic WITH fullstop included

*THEN short description MUST be detected.* AND long description, too.

## WHEN short description is italic WITH fullstop excluded

*THEN short description MUST be detected completely*. AND long description, too.


## WHEN short description is bold WITH fullstop included

**THEN short description MUST be detected.** AND long description, too.

## WHEN short description is bold WITH fullstop excluded

**THEN short description MUST be detected**. AND long description, too.


## WHEN short description has a link

THEN short description with a [link](./foo.bar) MUST be complete. AND long description MUST be complete, too.

## WHEN long description has a link

THEN short description MUST be complete. AND long description MUST be [link](./foo.bar) complete, too.
