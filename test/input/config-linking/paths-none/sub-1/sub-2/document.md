GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term 'First-Level-Parent' MUST be linked by an absolute URL `#first-level-parent`
AND *is expected* to be no longer navigable in a multi-file output fileset.

GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term 'Second-Level-Parent' MUST be linked by an absolute URL `#second-level-parent`
AND *is expected* to be no longer navigable in a multi-file output fileset.
