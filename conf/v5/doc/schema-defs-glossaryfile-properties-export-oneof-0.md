# 0 Properties



## file

A JSON file name to write exported terms to. Recommended file extension is '.json' or '.jsonld'

`file`

*   is required

*   Type: `string`

## context

File path or URL to a custom JSON-LD context document. JSON-LD contexts map terms from glossarify-md's export format onto terms of the well-known W3C SKOS vocabulary. If you want to import terms to another application supporting JSON-LD but not SKOS, then you can provide a custom JSON-LD context document with mappings of glossarify-md's terminology onto the one understood by the target application.

`context`

*   is optional

*   Type: `string`
