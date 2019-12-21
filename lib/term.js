class Term {
    constructor (data) {
        // We want to profit from Hidden Class Optimization. Thus initialize
        // all properties on object construction and don't add any further
        // properties dynamically (data may also not add any more properties).

        this.term = data.term || "";
        this.hint = data.hint || "";
        this.longDesc = data.longDesc || "";
        this.anchor = data.anchor || "";
        this.glossary = data.glossary || {};
        this.regex = data.regex || "";
        this.aliases = [...(data.aliases || [])];
        this.ignoreCase = false || data.ignoreCase;
        this.countOccurrenceTotal = 0;
        this.setTerm(this.term);
        this.setAliases(this.aliases);
    }

    setAliases(strArray) {
        this.aliases = strArray;
        updateRegExp(this);
    }

    setTerm(strTerm) {
        this.term = strTerm;
        updateRegExp(this);
    }

    countOccurrence() {
        this.countOccurrenceTotal++;
    }

    /**
     * A term's full description might be split accross nodes if it
     * contains markdown syntax elements. This method appends a
     * text-node value to the term's long description. It will care
     * for proper spacing and updating the term's short description.
     *
     * @param {*} strTextblock
     */
    appendDescription(strTextblock) {
        this.longDesc = `${this.longDesc}${this.longDesc ? " ": ""}${strTextblock}`
            .replace(/\s\./, ".")
            .replace(/\s{2,}\b/g, " ")
            .trim();
    }

    getLongDescription() {
        return this.longDesc;
    }

    getShortDescription() {
        const slices = this.longDesc.split(/(\.|\?|!)(?:\s|\n|$)/u);
        return `${slices[0].trim()}${slices[1] || ""}`;
    }

    toJSON() {
        // Don't add dynamic properties to 'this'. They do not belong there.
        // Also search for 'Hidden Class Optimization' to find out why we do
        // not add dynamic properties to 'this' and do not return 'this'.
        return Object.assign({
            shortDesc: this.getShortDescription()
        }, this);
    }
}

function updateRegExp(term) {

    const termAndAliases = [...term.aliases, term.term];
    let flags = "u";
    let regExp = `(`;

    // A shorter term may be a substring of a longer term which causes issues
    // when the regExp is used to split a text block (see #41). Thus we sort
    // sort by length descending to create a regExp which tests for the longest
    // term first.
    termAndAliases
        .map((term) => escapeRegExp(term))
        .sort((term1, term2) => term2.length - term1.length)
        .forEach((term, idx) => regExp += (idx > 0 ? "|" : "") + term)
    regExp += `)`;

    if (term.ignoreCase) {
        flags += "i";
    }

    term.regex = new RegExp(regExp, flags);
}

/**
 * We must expect terms to include characters with a special
 * meaning in regexp. Escape user provided terms to avoid
 * breaking the actual regexp search pattern.
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 *
 * @private
 * @param {*} string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = Term;
