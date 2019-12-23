# [Aliases and Synonyms](#aliases-and-synonyms)

## [Term 1](#term-1)

<!-- Aliases: T1 Alias1, T1-Alias2, T1.Alias3 -->

GIVEN there is an HTML-single-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated words MUST be detected as the term's aliases.

## [Term 2](#term-2)

<!--
Aliases: T2 Alias1, T2-Alias2, T2.Alias3
-->

GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated words MUST be detected as the term's aliases.

## [Term 3](#term-3)

<!--
Aliases:
T3 Alias1,
T3-Alias2,
T3.Alias3
-->

GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated lines of words MUST be detected as the term's aliases.

## [Term 4](#term-4)

<!--
Aliases:

T4 Alias1,
T4-Alias2,
T4.Alias3
-->

GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' and an empty
line THEN the subsequent comma-separated lines of words MUST be detected as the
term's aliases.

## [Term 5](#term-5)

<!-- Aliases: T5-Alias1, T5-Alias2, -->

GIVEN there is an HTML-single-line-comment beginning with 'Aliases:'
AND the comment ends with a trailing comma
THEN this MUST NOT result in an infinite loop or out-of-memory error
as has been reported in #26

## [Alias substring behavior](#alias-substring-behavior)

### [Issue](#issue)

<!-- Aliases: Issues -->

GIVEN a term "Issue"
AND an alias "Issues" WHERE _the alias_ begins with the term
THEN the alias MUST still be linked to the term, correctly.

### [OUR](#our)

<!-- Aliases: FLOURISH -->

GIVEN a term "OUR"
AND an alias "FLOURISH" WHERE _the alias_ includes the term
THEN the alias MUST still be linked to the term, correctly.

### [FIELD](#field)

<!-- Aliases: GREENFIELD -->

GIVEN a term "FIELD"
AND an alias "GREENFIELD" WHERE _the alias_ ends with the term
THEN the alias MUST still be linked to the term, correctly.

### [Hopefully](#hopefully)

<!-- Aliases: Hope -->

GIVEN a term "Hopefully"
AND an alias "Hope" WHERE _the term_ begins with the alias
THEN the alias MUST still be linked to the term, correctly.

### [Flower](#flower)

<!-- Aliases: lower -->

GIVEN a term "Flower"
AND an alias "lower" WHERE _the term_ ends with the alias
THEN the alias MUST still be linked to the term, correctly.

### [Friendship](#friendship)

<!-- Aliases: end -->

GIVEN a term "Friendship"
AND an alias "end" WHERE _the term_ includes the alias
THEN the alias MUST be linked to the term, correctly.

## [Unicode Support](#unicode-support)

### [China](#china)

<!-- Aliases: 中国zhōngguó, zhōngguó中国, 中zhōngguó国, zhōng中国guó -->

GIVEN there is an HTML-single-line-comment beginning with 'Aliases:'
AND aliases contain unicode word characters
THEN they MUST still be separated correctly
