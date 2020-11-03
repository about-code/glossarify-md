/**
 * @typedef {import('./glossary')} Glossary
 */
const {collator} = require("../text/collator");

class Term {

    /**
     * @param {Partial<Term>} data
     */
    constructor (data) {
        // We want to profit from Hidden Class Optimization. Thus initialize
        // all properties on object construction and don't add any further
        // properties dynamically (data may also not add any more properties).

        /** @type {string} */
        this.term = data.term || "";

        /** @type {string} */
        this.hint = data.hint || "";

        /** @type {string} */
        this.longDesc = data.longDesc || "";

        /** @type {string} */
        this.shortDesc = data.shortDesc || "";

        /** @type {string} */
        this.anchor = data.anchor || "";

        /** @type {Glossary} */
        this.glossary = data.glossary || {};

        /** @type {RegExp} */
        this.regex = data.regex || "";

        /** @type {string[]} */
        this.aliases = [...(data.aliases || [])];

        /** @type {boolean} */
        this.ignoreCase = false || data.ignoreCase;

        /** @type {number} */
        this.countOccurrenceTotal = 0;

        this.setTerm(this.term);
        this.setAliases(this.aliases);
    }

    /**
     * @param {string[]} strArray
     */
    setAliases(strArray) {
        this.aliases = strArray;
        updateSearchRegExp(this);
    }

    /**
     * @param {string} strTerm
     */
    setTerm(strTerm) {
        this.term = strTerm;
        updateSearchRegExp(this);
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
     * @param {string} strTextblock
     */
    appendDescription(strTextblock) {
        this.longDesc = `${this.longDesc}${this.longDesc ? " ": ""}${strTextblock}`
            .replace(/\s\./, ".")
            .replace(/\s{2,}\b/g, " ")
            .trim();

        const slices = this.longDesc.split(/(\.|\?|!)(?:\s|\n|$)/u);
        this.shortDesc = `${slices[0].trim()}${slices[1] || ""}`;
    }

    /**
     * Returns the complete glossary term description.
     *
     * @returns {string}
     */
    getLongDescription() {
        return this.longDesc;
    }

    /**
     * Returns the short glossary term description, e.g. just the first
     * sentence.
     *
     * @returns {string}
     */
    getShortDescription() {
        return this.shortDesc;
    }

    /**
     * @private
     */
    toJSON() {
        // Don't add dynamic properties to 'this'. They do not belong there.
        // Also search for 'Hidden Class Optimization' to find out why we do
        // not add dynamic properties to 'this' and do not return 'this'.
        return Object.assign({ shortDesc: this.getShortDescription() }, this);
    }
}

/**
 * Updates the regular expression used to search for the term in documents.
 * @param {*} term
 */
function updateSearchRegExp(term) {

    const termAndAliases = [...term.aliases, term.term];
    let flags = "u";
    let regExp = "(";

    // A shorter term may be a substring of a longer term which causes issues
    // when the regExp is used to split a text block (see #41). Thus we sort
    // sort by length descending to create a regExp which tests for the longest
    // term first.
    termAndAliases
        .map((term) => escapeRegExp(term))
        .sort((term1, term2) => term2.length - term1.length)
        .forEach((term, idx) => regExp += (idx > 0 ? "|" : "") + term);
    regExp += ")";

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
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * @static
 */
Term.compare = function(term1, term2) {
    return collator.compare(term1.term, term2.term);
};

module.exports.Term = Term;
