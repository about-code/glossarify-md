GIVEN there is term "[Term 1][1]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "[T1 Alias1][1]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T1-Alias2][1]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T1.Alias3][1]" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "[Term 2][2]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "[T2 Alias1][2]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T2-Alias2][2]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T2.Alias3][2]" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "[Term 3][3]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "T3 Alias1" THEN it CAN NOT be replaced with a link to the term's definition.
GIVEN there is the term's alias "T3-Alias2" THEN it CAN NOT be replaced with a link to the term's definition.
GIVEN there is the term's alias "T3.Alias3" THEN it CAN NOT be replaced with a link to the term's definition.

GIVEN there is term "[Term 4][4]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "T4 Alias1" THEN it CAN NOT be replaced with a link to the term's definition.
GIVEN there is the term's alias "T4-Alias2" THEN it CAN NOT be replaced with a link to the term's definition.
GIVEN there is the term's alias "T4.Alias3" THEN it CAN NOT be replaced with a link to the term's definition.

## [Alias substring behavior](#alias-substring-behavior)

GIVEN a term "[Issue][5]"
AND an alias "[Issues][5]" WHERE *the alias* begins with the term
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "[OUR][6]"
AND an alias "[FLOURISH][6]" WHERE *the alias* includes the term
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "[FIELD][7]"
AND an alias "[GREENFIELD][7]" WHERE *the alias* ends with the term
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "[Hopefully][8]"
AND an alias "[Hope][8]" WHERE *the term* begins with the alias
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "[Flower][9]"
AND an alias "[lower][9]" WHERE *the term* ends with the alias
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "[Friendship][10]"
AND an alias "[end][10]" WHERE *the term* includes the alias
THEN the alias MUST be linked to the term, correctly.

## [Unicode behavior](#unicode-behavior)

GIVEN a term "[China][11]"
AND alias [中国zhōngguó][11]
AND alias [zhōngguó中国][11]
AND alias [中zhōngguó国][11]
AND alias [zhōng中国guó][11]
WITH aliases containing non-ASCII unicode characters
THEN all aliases MUST still be separated and linked correctly

[1]: ./glossary.md#term-1 "GIVEN there is an HTML-single-line-comment beginning with \"aliases\": THEN the
subsequent comma-separated words MUST be detected as the term's aliases."

[2]: ./glossary.md#term-2 "GIVEN there is an HTML-multi-line-comment beginning with \"aliases\": THEN the
subsequent comma-separated words MUST be detected as the term's aliases."

[3]: ./glossary.md#term-3 "GIVEN there is an HTML-multi-line-comment beginning with \"aliases\": THEN the
subsequent comma-separated lines of words is invalid JSON
AND CAN NOT be detected as the term's aliases."

[4]: ./glossary.md#term-4 "GIVEN there is an HTML-multi-line-comment beginning with \"aliases\": and an empty
line THEN the subsequent comma-separated lines of words is invalid JSON
AND CAN NOT be detected as the term's aliases."

[5]: ./glossary.md#issue "GIVEN a term \"Issue\"
AND an alias \"Issues\" WHERE the alias begins with the term
THEN the alias MUST still be linked to the term, correctly."

[6]: ./glossary.md#our "GIVEN a term \"OUR\"
AND an alias \"FLOURISH\" WHERE the alias includes the term
THEN the alias MUST still be linked to the term, correctly."

[7]: ./glossary.md#field "GIVEN a term \"FIELD\"
AND an alias \"GREENFIELD\" WHERE the alias ends with the term
THEN the alias MUST still be linked to the term, correctly."

[8]: ./glossary.md#hopefully "GIVEN a term \"Hopefully\"
AND an alias \"Hope\" WHERE the term begins with the alias
THEN the alias MUST still be linked to the term, correctly."

[9]: ./glossary.md#flower "GIVEN a term \"Flower\"
AND an alias \"lower\" WHERE the term ends with the alias
THEN the alias MUST still be linked to the term, correctly."

[10]: ./glossary.md#friendship "GIVEN a term \"Friendship\"
AND an alias \"end\" WHERE the term includes the alias
THEN the alias MUST be linked to the term, correctly."

[11]: ./glossary.md#china "GIVEN there is an HTML-single-line-comment beginning with \"aliases\":
AND aliases contain unicode word characters
THEN they MUST still be separated correctly"
