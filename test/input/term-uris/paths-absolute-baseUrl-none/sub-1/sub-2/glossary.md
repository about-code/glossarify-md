# Test

## Nested

GIVEN this glossary has *no* URI
AND option 'linking.paths: "absolute"'
AND option 'linking.baseUrl' is missing
AND option 'linking.pathComponents: ["path", "file"]'
AND option 'dev.termsFile: "terms.json"' writes a terms.json
THEN the URI of this term in terms.json MUST be sub-1/sub-2/glossary#term

## Custom {#custom}

GIVEN this glossary has *no* URI
AND option 'linking.paths: "absolute"'
AND option 'linking.baseUrl' is missing
AND option 'linking.pathComponents: ["path", "file"]'
AND option 'dev.termsFile: "terms.json"' writes a terms.json
AND this heading has a custom pandoc-style heading ID
THEN the URI of this term in terms.json MUST be sub-1/sub-2/glossary#custom
