# [Document](#a98d39360641768edc2f3de92e4ccbda)

GIVEN a term `HashId` without an explict heading id
AND a term `PandocId` with an explicit heading id {#pandoc-id}
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN

*   the term *[HashId][1]* MUST be linkified AND MUST use an MD5 url fragment
*   the term *[PandocId][2]* MUST be linkified AND MUST use the #pandoc-id fragment
*   a link *[arbitrary][3]* MUST be linked to the definition of *[PandocId][2]*

[1]: ./glossary.md#fca655472ff237c3473c7a07cb6529fb "A term which expects an id hash to be generated."

[2]: ./glossary.md#pandoc-id "A term with a custom pandoc-id"

[3]: ./glossary.md#pandoc-id
