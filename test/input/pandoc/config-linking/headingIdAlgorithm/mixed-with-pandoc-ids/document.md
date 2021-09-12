# Document

GIVEN a term `HashId` without an explict heading id
AND a term `PandocId` with an explicit heading id {#pandoc-id}
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN
- the term *HashId* MUST be linkified AND MUST use an MD5 url fragment
- the term *PandocId* MUST be linkified AND MUST use the #pandoc-id fragment
- a link *[arbitrary](#pandoc-id)* MUST be linked to the definition of *PandocId*
