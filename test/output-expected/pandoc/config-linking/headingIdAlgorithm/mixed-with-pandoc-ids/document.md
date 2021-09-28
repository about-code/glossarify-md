# [Document](#md5-2986946ec8cb3db51d9d8fd8237d1498)

GIVEN a term `HashId` without an explict heading id
AND a term `PandocId` with an explicit heading id {#pandoc-id}
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN

*   the term *[HashId][1]* MUST be linkified AND MUST use an MD5 url fragment
*   the term *[PandocId][2]* MUST be linkified AND MUST use the #pandoc-id fragment
*   a link *[arbitrary][3]* MUST be linked to the definition of *[PandocId][2]*

[1]: ./glossary.md#md5-248f8262c302ee60e754694adae92d88 "A term which expects an id hash to be generated."

[2]: ./glossary.md#pandoc-id "A term with a custom pandoc-id"

[3]: ./glossary.md#pandoc-id
