# [Testing config option 'reportNotMentioned'](#testing-config-option-reportnotmentioned)

GIVEN a term '[Mentioned][1]' being mentioned
AND option `reportNotMentioned: true`
THEN the report MUST NOT list this term.

GIVEN another term being neither mentioned here nor anywhere else
AND option `reportNotMentioned: true`
THEN the report MUST list at least one term not being mentioned.

[1]: ./glossary.md#mentioned
