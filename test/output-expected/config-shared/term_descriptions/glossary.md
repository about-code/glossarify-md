# [Formatted Term Definitions](#formatted-term-definitions)

## [GIVEN short description is a blockquote](#given-short-description-is-a-blockquote)

> THEN short description MUST be detected completely.

AND long description MUST be complete, too.

## [GIVEN long description is a blockquote](#given-long-description-is-a-blockquote)

THEN short description MUST be detected completely.

> AND long description MUST be complete, too.

## [GIVEN full description is a blockquote](#given-full-description-is-a-blockquote)

> THEN short description MUST be detected completely. AND long description MUST be complete, too.

## [GIVEN short description is italic WITH fullstop included](#given-short-description-is-italic-with-fullstop-included)

_THEN short description MUST be detected completely._ AND long description MUST be complete, too.

## [GIVEN short description is italic WITH fullstop excluded](#given-short-description-is-italic-with-fullstop-excluded)

_THEN short description MUST be detected completely_. AND long description MUST be complete, too.

## [GIVEN short description is bold WITH fullstop included](#given-short-description-is-bold-with-fullstop-included)

**THEN short description MUST be detected completely.** AND long description MUST be complete, too.

## [GIVEN short description is bold WITH fullstop excluded](#given-short-description-is-bold-with-fullstop-excluded)

**THEN short description MUST be detected completely**. AND long description MUST be complete, too.

## [GIVEN short description has a link](#given-short-description-has-a-link)

THEN short description with a [link](./foo.md) MUST be detected completely. AND long description MUST be complete, too.

## [GIVEN long description has a link](#given-long-description-has-a-link)

THEN short description MUST be detected completely. AND long description with a [link](./foo.md) MUST be complete, too.
