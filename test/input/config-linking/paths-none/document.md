# Document

> **Note:** Option `linking.paths: "none"` is intended to be used together with
> a hash based heading ID algorithm such as `linking.headingIdAlgorithm: "md5"`
> to prepare output files for single-file-concatenation with post-processors
> like pandoc. A post-processed output file then may only be navigable correctly
> with URL fragments. Tests use, without expressivity of the test itself, the
> non-hashed `linking.headingIdAlgorithm: "github"` to ease human judgement
> about test results.

## Test Case 1

GIVEN option `linking.paths: "none"`
THEN term 'Sibling' MUST be linked by URL fragment `#absolute`, only
AND *is expected* to be no longer navigable in a multi-file output fileset.

## Test Case 2

GIVEN option `linking.paths: "none"`
THEN term 'First-Level-Child' MUST by its hash `#first-level-child`, only.
AND *is expected* to be no longer navigable in a multi-file output fileset.
