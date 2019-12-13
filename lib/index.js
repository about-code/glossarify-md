const {relativeFromTo} = require("./pathplus");
const path = require("path");

const api = {};
let md = "";

api.writeIndex = function(context) {
    md =
`# Index
`;
    const {terms: dict, opts} = context;
    const {outDir, indexFile} = opts;
    const terms = dict.inOrder();
    for (let i = 0, iLen = terms.length; i < iLen; i++) {
        const term = terms[i];
        const text = term.term;
        const glossaryUrl = relativeFromTo(
            path.resolve(outDir, indexFile),
            path.resolve(outDir, term.glossary.file)
        ) + term.anchor;
        md +=
`
#### ${text} ([${term.glossary.title || "Glossary"}](${glossaryUrl}))

`;
        const occurrences = terms[i].occurrences;
        for (url of Object.keys(occurrences)) {
            md +=
`* [${occurrences[url]}](${url})
`;
        }
    };
    return md;
}
module.exports = api;
