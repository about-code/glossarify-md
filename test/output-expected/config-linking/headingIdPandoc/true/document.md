# [Document](#document) {#document}

GIVEN a document *Document*
AND a configuration `linking.headingIdPandoc: true`

## [Section to add id](#section-to-add-id) {#section-to-add-id}

THEN this heading MUST get appended `{#section-to-add-id}`.

## [Section to keep id](#keep-id) {#keep-id}

THEN this heading MUST NOT be modified and match `{#keep-id}`.
