GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term '[First-Level-Parent][1]' MUST be linked by an absolute URL `#first-level-parent`
AND *is expected* to be no longer navigable in a multi-file output fileset.

GIVEN option 'linking: absolute'
AND option 'baseUrl: ${baseUrl}'
THEN term '[Second-Level-Parent][2]' MUST be linked by an absolute URL `#second-level-parent`
AND *is expected* to be no longer navigable in a multi-file output fileset.

[1]: #first-level-parent "...MUST be referred to in './sub-2/document.md' by #first-level-parent
AND is expected to be no longer navigable in a multi-file output fileset."

[2]: #second-level-parent "...MUST be referred to in './sub-1/sub-2/document.md' with #second-level-parent
AND is expected to be no longer navigable in a multi-file output fileset."
