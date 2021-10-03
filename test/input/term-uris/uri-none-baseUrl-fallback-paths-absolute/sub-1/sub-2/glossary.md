# Glossary without URI but fallback to baseUrl

GIVEN this glossary has *no* URI
AND option 'linking.baseUrl' is "https://base.url/vocab/"
AND option 'linking.paths: "absolute"'
AND option 'linking.pathComponents: ["path", "file"]'
AND option `dev.termsFile: "terms.json"` writes a file `terms.json` ...

## Term
...
THEN in `terms.json` the term's URI MUST be https://base.url/vocab/sub-1/sub-2/glossary#term
AND MUST NOT contain `.md` file extension (e.g. ... /glossary.md#term)

## Custom {#custom}
...
AND this heading has a custom pandoc-style heading ID
THEN in `terms.json` the term's URI MUST be https://base.url/vocab/sub-1/sub-2/glossary#custom
AND MUST NOT contain `.md` file extension (e.g. ... /glossary.md#custom)
