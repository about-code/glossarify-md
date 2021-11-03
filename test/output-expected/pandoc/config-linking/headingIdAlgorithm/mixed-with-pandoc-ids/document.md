# [Document](#md5-0a9a7c434319a2b60e9c820ab9fecba4)

GIVEN a term `HashId` without an explict heading id
AND a term `PandocId` with an explicit heading id {#pandoc-id}
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN

*   the term *[HashId][1]* MUST be linkified AND MUST use an MD5 url fragment
*   the term *[PandocId][2]* MUST be linkified AND MUST use the #pandoc-id fragment
*   a link *[arbitrary][3]* MUST be linked to the definition of *[PandocId][2]*

[1]: ./glossary.md#md5-de0b62fa03c4c0dcffcc53b3d6d330be "A term which expects an id hash to be generated."

[2]: ./glossary.md#pandoc-id "A term with a custom pandoc-id"

[3]: ./glossary.md#pandoc-id
