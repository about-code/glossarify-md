/**
 * @typedef {import('./glossary')} Glossary
 */
const {collator} = require("../../text/collator");

const api = {};
api.TermDefinition = class TermDefinition {

    /**
     * @param {Partial<TermDefinition>} data
     */
    constructor (data) {

        this.type = api.TermDefinition.type;
        // We want to profit from Hidden Class Optimization. Thus initialize
        // all properties on object construction and don't add any further
        // properties dynamically (data may also not add any more properties).

        /** @type {string} */
        this.value = data.value || "";

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

        this.setTerm(this.value);
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
        this.value = strTerm;
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
};
api.TermDefinition.type = Symbol("term-definition");
/**
 * @static
 * @param {Term} t1
 * @param {Term} t2
 */
api.TermDefinition.compare = function(t1, t2) {
    let primaryOrder = collator.compare(t1.value, t2.value);
    if (primaryOrder !== 0) {
        return primaryOrder;
    } else {
        return collator.compare(t1.glossary.file, t2.glossary.file);
    }
};

/**
 * Updates the regular expression used to search for the term in documents.
 * @param {*} term
 */
function updateSearchRegExp(term) {

    const termAndAliases = [...term.aliases, term.value];
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


api.withTermDefinition = function() {
    registerStringifier(this.Compiler);
    return (tree) => tree;
};

function registerStringifier(compiler) {
    compiler.prototype.visitors[api.TermDefinition.type] = () => {};
}

module.exports = api;
