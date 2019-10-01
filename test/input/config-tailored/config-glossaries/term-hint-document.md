GIVEN a term hint '↴' without a placeholder '${term}'
THEN the term hint '↴' is appended to term 'Term-Hint-Suffix-Default'.

GIVEN a term hint '${term}☚' WITH a placeholder '${term}'
THEN the term hint symbol '☚' is appended to term 'Term-Hint-Suffix'.

GIVEN a term hint '☛${term}' WITH a placeholder '${term}'
THEN the term hint symbol '☛' is prepended to term 'Term-Hint-Prefix'.

GIVEN a term hint '☛ ${term} ☚' WITH a placeholder '${term}'
THEN the term hint symbols '☛ ' and ' ☚' MUST wrap around term 'Term-Hint-Wrapped'.
