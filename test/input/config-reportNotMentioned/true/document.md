# Testing config option 'reportNotMentioned'

GIVEN a term 'Mentioned' being mentioned
AND option `reportNotMentioned: true`
THEN the report MUST NOT list this term.

GIVEN another term being neither mentioned here nor anywhere else
AND option `reportNotMentioned: true`
THEN the report MUST list at least one term not being mentioned.
