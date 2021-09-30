# [Document](#md5:9a6dcfaad59049db6e262eb2fa080820)

GIVEN a term `HashId` without an explict heading id
AND a term `PandocId` with an explicit heading id {#pandoc-id}
AND a configuration `linking.headingIdAlgorithm: "md5"`
THEN

*   the term *[HashId][1]* MUST be linkified AND MUST use an MD5 url fragment
*   the term *[PandocId][2]* MUST be linkified AND MUST use the #pandoc-id fragment
*   a link *[arbitrary][3]* MUST be linked to the definition of *[PandocId][2]*

[1]: ./glossary.md#md5:5e740a24628bd5771ff3da39c4cc4f54 "A term which expects an id hash to be generated."

[2]: ./glossary.md#pandoc-id "A term with a custom pandoc-id"

[3]: ./glossary.md#pandoc-id
