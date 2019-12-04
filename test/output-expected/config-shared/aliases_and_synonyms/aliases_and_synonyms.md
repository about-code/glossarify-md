GIVEN there is term "[Term 1][1]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "[T1 Alias1][1]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T1-Alias2][1]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T1.Alias3][1]" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "[Term 2][2]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "[T2 Alias1][2]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T2-Alias2][2]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T2.Alias3][2]" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "[Term 3][3]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "[T3 Alias1][3]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T3-Alias2][3]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T3.Alias3][3]" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "[Term 4][4]" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "[T4 Alias1][4]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T4-Alias2][4]" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "[T4.Alias3][4]" THEN it MUST be replaced with a link to the term's definition.

GIVEN a term "[China][5]"
AND alias [中国zhōngguó][5]
AND alias [zhōngguó中国][5]
AND alias [中zhōngguó国][5]
AND alias [zhōng中国guó][5]
WITH aliases containing non-ASCII unicode characters
THEN all aliases MUST still be separated and linked correctly

Given a term "[Issue][6]"
AND alias [Issues][6]
THEN occurrences of the alias MUST be linked with the terms definition.

[1]: glossary.md#term-1 "GIVEN there is an HTML-single-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated words MUST be detected as the term's aliases."

[2]: glossary.md#term-2 "GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated words MUST be detected as the term's aliases."

[3]: glossary.md#term-3 "GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated lines of words MUST be detected as the term's aliases."

[4]: glossary.md#term-4 "GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' and an empty
line THEN the subsequent comma-separated lines of words MUST be detected as the
term's aliases."

[5]: glossary.md#china "GIVEN there is an HTML-single-line-comment beginning with 'Aliases:'
AND aliases contain unicode word characters
THEN they MUST still be separated correctly"

[6]: glossary.md#issue "Damit wird der Verstoß gegen eine SonarQube-Regel bezeichnet."
