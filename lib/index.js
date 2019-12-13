const {relativeFromTo, toForwardSlash} = require("./pathplus");
const path = require("path");

const api = {};
let md = "";

api.writeIndex = function(context) {
    md =
`# Index
`;
    const {terms: dict, opts} = context;
    const {outDir, generateFiles} = opts;
    const {indexFile} = generateFiles;
    const terms = dict.inOrder();
    for (let i = 0, iLen = terms.length; i < iLen; i++) {
        const term = terms[i];
        const text = term.term;
        const glossaryUrl = toForwardSlash(
            relativeFromTo(
                path.resolve(outDir, indexFile || "."),
                path.resolve(outDir, term.glossary.file)
            ) + term.anchor
        );
        md +=
`
#### ${text} ([${term.glossary.title || "Glossary"}](${glossaryUrl}))

`;
        const occurrences = terms[i].occurrences;
        for (url of Object.keys(occurrences)) {
            md +=
`* [${occurrences[url]}](${toForwardSlash(url)})
`;
        }
    };
    return md;
}
module.exports = api;
