# Testing Config Option ignoreCase

## First-Uppercase

WHEN term is [First-Uppercase][1] AND ignoreCase is 'false' THEN term occurence 'first-uppercase' MUST NOT be linked with it.

## ALL-UPPERCASE

WHEN term is '[ALL-UPPERCASE][2]' AND ignoreCase is 'false' THEN term occurence 'all-uppercase' MUST NOT be linked with it.

## fIRST-lOWERCASE

WHEN term is '[fIRST-lOWERCASE][3]' AND ignoreCase is 'false' THEN term occurence 'First-Lowercase' MUST NOT be linked with it.

## all-lowercase

WHEN term is '[all-lowercase][4]' AND ignoreCase is 'false' THEN term occurence 'ALL-LOWERCASE' MUST NOT be linked with it.

## MiXeD-CaSe

WHEN term is '[MiXeD-CaSe][5]' AND ignoreCase is 'false' THEN term occurence 'mIxEd-cAsE' MUST NOT be linked with it.

[1]: glossary.md#first-uppercase

[2]: glossary.md#all-uppercase

[3]: glossary.md#first-lowercase

[4]: glossary.md#all-lowercase

[5]: glossary.md#mixed-case
