const {relativeFromTo, toForwardSlash} = require("./pathplus");
const path = require("path");

const api = {};

api.writeIndex = function(context) {
    let md = `# Index\n\n`;
    const {terms: dict, opts} = context;
    const {outDir, generateFiles} = opts;
    const {indexFile} = generateFiles;
    dict.byDefinition().forEach((terms) => {
        const text = terms[0].term;
        const occurrences = terms[0].occurrences; // [1]
        md += `\n\n#### ${text}\n\n`;

        // Link to glossary definitions
        for (term of terms) {
            md += ` - [${term.glossary.title}](${getGlossaryUrl(term, outDir, indexFile)})`;
        };

        // Links to occurrences
        for (url of Object.keys(occurrences)) {
            md += ` - [${occurrences[url]}](${toForwardSlash(url)})`;
        }
    });
    return md;
}

function getGlossaryUrl(term, outDir, indexFile) {
    return toForwardSlash(
        relativeFromTo(
            path.resolve(outDir, indexFile || "."),
            path.resolve(outDir, term.glossary.file)
        ) + term.anchor
    );
}

module.exports = api;
