# [Aliases and Synonyms](#aliases-and-synonyms)

## [Term 1](#term-1)

<!-- aliases: T1 Alias1, T1-Alias2, T1.Alias3 -->

GIVEN there is an HTML-single-line-comment beginning with "aliases": THEN the
subsequent comma-separated words MUST be detected as the term's aliases.

## [Term 2](#term-2)

<!--
aliases: T2 Alias1, T2-Alias2, T2.Alias3
-->

GIVEN there is an HTML-multi-line-comment beginning with "aliases":
THEN the subsequent comma-separated words MUST be detected as the term's aliases.

## [Term 3](#term-3)

<!--
aliases:
- T3 Alias1
- T3-Alias2
- T3.Alias3
-->

GIVEN there is a YAML list beginning with "aliases":
THEN the subsequent list of words MUST be detected as the term's aliases.

## [Term 4](#term-4)

<!--
aliases:

T4 Alias1
T4-Alias2
T4.Alias3
-->

GIVEN there is a multi-line-comment beginning with "aliases": and an empty line
THEN the subsequent comma-separated lines of words is invalid YAML AND CAN NOT be detected as the term's aliases.

## [Term 5](#term-5)

<!-- aliases: T5-Alias1, T5-Alias2, -->

GIVEN there is a single-line-comment beginning with "aliases":
AND the comment ends with a trailing comma THEN this MUST NOT result in an infinite loop or out-of-memory error as has been reported in #26

## [Alias substring behavior](#alias-substring-behavior)

### [Issue](#issue)

<!-- aliases: Issues -->

GIVEN a term "[Issue][1]" AND an alias "[Issues][1]" WHERE *the alias* begins with the term
THEN the alias MUST still be linked to the term, correctly.

### [OUR](#our)

<!-- aliases: FLOURISH -->

GIVEN a term "[OUR][2]" AND an alias "[FLOURISH][2]" WHERE *the alias* includes the term
THEN the alias MUST still be linked to the term, correctly.

### [FIELD](#field)

<!-- aliases: GREENFIELD -->

GIVEN a term "[FIELD][3]" AND an alias "[GREENFIELD][3]" WHERE *the alias* ends with the term
THEN the alias MUST still be linked to the term, correctly.

### [Hopefully](#hopefully)

<!-- aliases: Hope -->

GIVEN a term "[Hopefully][4]" AND an alias "[Hope][4]" WHERE *the term* begins with the alias
THEN the alias MUST still be linked to the term, correctly.

### [Flower](#flower)

<!-- aliases: lower -->

GIVEN a term "[Flower][5]" AND an alias "[lower][5]" WHERE *the term* ends with the alias
THEN the alias MUST still be linked to the term, correctly.

### [Friendship](#friendship)

<!-- aliases: end -->

GIVEN a term "[Friendship][6]" AND an alias "[end][6]" WHERE *the term* includes the alias
THEN the alias MUST be linked to the term, correctly.

## [Unicode Support](#unicode-support)

### [China](#china)

<!-- aliases: 中国zhōngguó, zhōngguó中国, 中zhōngguó国, zhōng中国guó -->

GIVEN there is an HTML-single-line-comment beginning with "aliases":
AND aliases contain unicode word characters
THEN they MUST still be separated correctly

[1]: #issue "GIVEN a term \"Issue\" AND an alias \"Issues\" WHERE the alias begins with the term
THEN the alias MUST still be linked to the term, correctly."

[2]: #our "GIVEN a term \"OUR\" AND an alias \"FLOURISH\" WHERE the alias includes the term
THEN the alias MUST still be linked to the term, correctly."

[3]: #field "GIVEN a term \"FIELD\" AND an alias \"GREENFIELD\" WHERE the alias ends with the term
THEN the alias MUST still be linked to the term, correctly."

[4]: #hopefully "GIVEN a term \"Hopefully\" AND an alias \"Hope\" WHERE the term begins with the alias
THEN the alias MUST still be linked to the term, correctly."

[5]: #flower "GIVEN a term \"Flower\" AND an alias \"lower\" WHERE the term ends with the alias
THEN the alias MUST still be linked to the term, correctly."

[6]: #friendship "GIVEN a term \"Friendship\" AND an alias \"end\" WHERE the term includes the alias
THEN the alias MUST be linked to the term, correctly."
