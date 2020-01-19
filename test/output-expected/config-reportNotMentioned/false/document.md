# [Testing config option 'reportNotMentioned'](#testing-config-option-reportnotmentioned)

GIVEN a term '[Mentioned][1]' being mentioned
AND option `reportNotMentioned: false`
THEN the report MUST NOT list this term.

GIVEN another term being neither mentioned here nor anywhere else
AND option `reportNotMentioned: false`
THEN the report MUST NOT list anything due to reporting being disabled.

[1]: ./glossary.md#mentioned
