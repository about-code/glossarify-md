# Testing Config Option ignoreCase

## First-Uppercase

WHEN term is First-Uppercase AND ignoreCase is 'false' THEN term occurence 'first-uppercase' MUST NOT be linked with it.

## ALL-UPPERCASE

WHEN term is 'ALL-UPPERCASE' AND ignoreCase is 'false' THEN term occurence 'all-uppercase' MUST NOT be linked with it.

## fIRST-lOWERCASE

WHEN term is 'fIRST-lOWERCASE' AND ignoreCase is 'false' THEN term occurence 'First-Lowercase' MUST NOT be linked with it.

## all-lowercase

WHEN term is 'all-lowercase' AND ignoreCase is 'false' THEN term occurence 'ALL-LOWERCASE' MUST NOT be linked with it.

## MiXeD-CaSe

WHEN term is 'MiXeD-CaSe' AND ignoreCase is 'false' THEN term occurence 'mIxEd-cAsE' MUST NOT be linked with it.
