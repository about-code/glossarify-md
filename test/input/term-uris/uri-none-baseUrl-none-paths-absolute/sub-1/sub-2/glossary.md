# Glossary Without URI

GIVEN this glossary has *no* URI
AND option 'linking.baseUrl' is missing (no fallback)
AND option 'linking.paths: "absolute"'
AND option 'linking.pathComponents: ["path", "file"]'
AND option 'dev.termsFile: "terms.json"' writes a terms.json ...

## Term
...
THEN in terms.json the term's URI MUST be sub-1/sub-2/glossary#term
AND MUST NOT contain `.md` file extension (e.g. sub-1/sub-2/glossary.md#term)

## Custom {#custom}
...
AND this heading has a custom pandoc-style heading ID
THEN in terms.json the term's URI MUST be sub-1/sub-2/glossary#custom
AND MUST NOT contain `.md` file extension (e.g. sub-1/sub-2/glossary.md#custom)
