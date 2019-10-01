# Testing Config Option ignoreCase

## First-Uppercase

GIVEN term is [First-Uppercase][1] AND ignoreCase is 'true' THEN term occurence '[first-uppercase][1]' MUST be linked with it, too.

## ALL-UPPERCASE

GIVEN term is '[ALL-UPPERCASE][2]' AND ignoreCase is 'true' THEN term occurence '[all-uppercase][2]' MUST be linked with it, too.

## fIRST-lOWERCASE

GIVEN term is '[fIRST-lOWERCASE][3]' AND ignoreCase is 'true' THEN term occurence '[First-Lowercase][3]' MUST be linked with it, too.

## all-lowercase

GIVEN term is '[all-lowercase][4]' AND ignoreCase is 'true' THEN term occurence '[ALL-LOWERCASE][4]' MUST be linked with it, too.

## MiXeD-CaSe

GIVEN term is '[MiXeD-CaSe][5]' AND ignoreCase is 'true' THEN term occurence '[mIxEd-cAsE][5]' MUST be linked with it, too.

[1]: glossary.md#first-uppercase

[2]: glossary.md#all-uppercase

[3]: glossary.md#first-lowercase

[4]: glossary.md#all-lowercase

[5]: glossary.md#mixed-case
