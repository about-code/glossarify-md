GIVEN there is term "Term 1" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "T1 Alias1" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T1-Alias2" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T1.Alias3" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "Term 2" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "T2 Alias1" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T2-Alias2" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T2.Alias3" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "Term 3" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "T3 Alias1" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T3-Alias2" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T3.Alias3" THEN it MUST be replaced with a link to the term's definition.

GIVEN there is term "Term 4" THEN it MUST be replaced with a link to its definition.
GIVEN there is the term's alias "T4 Alias1" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T4-Alias2" THEN it MUST be replaced with a link to the term's definition.
GIVEN there is the term's alias "T4.Alias3" THEN it MUST be replaced with a link to the term's definition.

## Alias substring behavior

GIVEN a term "Issue"
AND an alias "Issues" WHERE *the alias* begins with the term
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "OUR"
AND an alias "FLOURISH" WHERE *the alias* includes the term
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "FIELD"
AND an alias "GREENFIELD" WHERE *the alias* ends with the term
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "Hopefully"
AND an alias "Hope" WHERE *the term* begins with the alias
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "Flower"
AND an alias "lower" WHERE *the term* ends with the alias
THEN the alias MUST still be linked to the term, correctly.

GIVEN a term "Friendship"
AND an alias "end" WHERE *the term* includes the alias
THEN the alias MUST be linked to the term, correctly.

## Unicode behavior

GIVEN a term "China"
AND alias 中国zhōngguó
AND alias zhōngguó中国
AND alias 中zhōngguó国
AND alias zhōng中国guó
WITH aliases containing non-ASCII unicode characters
THEN all aliases MUST still be separated and linked correctly
