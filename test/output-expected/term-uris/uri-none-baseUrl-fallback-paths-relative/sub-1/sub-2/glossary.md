# [Glossary without URI but fallback to baseUrl](#glossary-without-uri-but-fallback-to-baseurl)

GIVEN this glossary has *no* URI
AND option 'linking.baseUrl' is "[https://base.url/vocab/][1]"
AND option 'linking.paths: "relative"'
AND option 'linking.pathComponents: \["path", "file"]'
AND option `dev.termsFile: "terms.json"` writes a file `terms.json` ...

## [Term](#term)

...
THEN in `terms.json` the term's URI MUST be [https://base.url/vocab/sub-1/sub-2/glossary#term][2]
AND MUST NOT contain `.md` file extension (e.g. ... /glossary.md#term)

## [Custom](#custom)

...
AND this heading has a custom pandoc-style heading ID
THEN in `terms.json` the term's URI MUST be [https://base.url/vocab/sub-1/sub-2/glossary#custom][3]
AND MUST NOT contain `.md` file extension (e.g. ... /glossary.md#custom)

[1]: https://base.url/vocab/

[2]: https://base.url/vocab/sub-1/sub-2/glossary#term

[3]: https://base.url/vocab/sub-1/sub-2/glossary#custom
