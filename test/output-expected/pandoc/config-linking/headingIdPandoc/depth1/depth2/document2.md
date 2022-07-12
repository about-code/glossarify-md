# [Document 2](#document-2)

## [Section 1: Linking two levels up](#section-2-1)

This MUST link to [../../document0.md#section-0-1][1].

## [Section 2: Being linked from two levels up](#section-2-2)

Text

[1]: ../../document0.md#section-0-1 "GIVEN a document file document0.md AND a document file depth1/document1.md AND a document file depth1/depth2/document2.md WITH document file document0.md declaring a heading of arbitrary wording AND declaring a unique pandoc-style heading id {#section-0-1} THEN any occurrence of [foo](#section-0-1) in depth1/document1.md MUST resolve to../document0#section-0-1 AND any occurrence of [bar](#section-0-1) in depth2/document2.md MUST resolve to../../document0#section-0-1."
