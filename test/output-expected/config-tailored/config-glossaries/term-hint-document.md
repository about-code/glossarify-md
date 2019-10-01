GIVEN a term hint '↴' without a placeholder '${term}'
THEN the term hint '↴' is appended to term '[Term-Hint-Suffix-Default↴][1]'.

GIVEN a term hint '${term}☚' WITH a placeholder '${term}'
THEN the term hint symbol '☚' is appended to term '[Term-Hint-Suffix ☚][2]'.

GIVEN a term hint '☛${term}' WITH a placeholder '${term}'
THEN the term hint symbol '☛' is prepended to term '[☛ Term-Hint-Prefix][3]'.

GIVEN a term hint '☛ ${term} ☚' WITH a placeholder '${term}'
THEN the term hint symbols '☛ ' and ' ☚' MUST wrap around term '[☛ Term-Hint-Wrapped ☚][4]'.

[1]: term-hint-suffix-default-glossary.md#term-hint-suffix-default

[2]: term-hint-suffix-glossary.md#term-hint-suffix

[3]: term-hint-prefix-glossary.md#term-hint-prefix

[4]: term-hint-wrapped-glossary.md#term-hint-wrapped
