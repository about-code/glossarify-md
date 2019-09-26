# Aliases and Synonyms

## Term 1
<!-- Aliases: T1 Alias1, T1-Alias2, T1.Alias3 -->
GIVEN there is an HTML-single-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated words MUST be detected as the term's aliases.

## Term 2
<!--
Aliases: T2 Alias1, T2-Alias2, T2.Alias3
-->
GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated words MUST be detected as the term's aliases.

## Term 3
<!--
Aliases:
T3 Alias1,
T3-Alias2,
T3.Alias3
-->
GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' THEN the
subsequent comma-separated lines of words MUST be detected as the term's aliases.

## Term 4
<!--
Aliases:

T4 Alias1,
T4-Alias2,
T4.Alias3
-->
GIVEN there is an HTML-multi-line-comment beginning with 'Aliases:' and an empty
line THEN the subsequent comma-separated lines of words MUST be detected as the
term's aliases.

## Term 5
<!-- Aliases: T5-Alias1, T5-Alias2, -->
GIVEN there is an HTML-single-line-comment beginning with 'Aliases:'
AND the comment ends with a trailing comma
THEN this MUST NOT result in an infinite loop or out-of-memory error
as has been reported in #26


## Unicode Support

### China
<!-- Aliases: 中国zhōngguó, zhōngguó中国, 中zhōngguó国, zhōng中国guó -->
GIVEN there is an HTML-single-line-comment beginning with 'Aliases:'
AND aliases contain unicode word characters
THEN they MUST still be separated correctly
