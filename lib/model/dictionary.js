const {collator} = require("../text/collator");

/**
 * @typedef {import('./term')} Term
 * @param {Term} t1
 * @param {Term} t2
 */
function termComparator(t1, t2) {
    // primary order: by term
    // secondary order: by filename (if terms are equal)
    let primaryOrder = collator.compare(t1.term, t2.term);
    if (primaryOrder !== 0) {
        return primaryOrder;
    } else {
        return collator.compare(t1.glossary.file, t2.glossary.file);
    }
}


class Dictionary {
    constructor() {
        this._byAnchor = {};
        this._byOccurrence = [];
    }

    add(term) {
        this._byOccurrence.push(term);
        const anchor = term.anchor;
        /**
         * The anchor is better suited as a key, since it is sluggified
         * for use in URLs, thus only contains a limited set of characters.
         */
        if (this._byAnchor[anchor]) {
            this._byAnchor[anchor].push(term);
        } else {
            this._byAnchor[anchor] = [term];
        }
    }

    /**
     * Returns the most recently added term or null if none was added so far.
     */
    getLatest() {
        return this._byOccurrence[this._byOccurrence.length - 1];
    }

    /**
     * Returns an array of all definitions of a term when defined in multiple
     * glossaries. If a term was only defined once the array only contains a
     * single item.
     *
     * @param {*} anchor
     */
    byAnchor(anchor) {
        return this._byAnchor[anchor].sort(termComparator) || [];
    }

    byOccurrence() {
        return [... this._byOccurrence];
    }

    /**
     * Returns a two-dimentional array of term definitions in alphabetical
     * order where the first dimension represents a term and the second all
     * its definitions in particular glossaries.
     */
    // Implementation note:
    // Establishes an order on both dimensions. The term instances in 2nd
    // dimension are sorted based on term and glossary path for reproducable
    // results and reliable diff-testing. Otherwise if a term were defined in
    // two glossaries the order of link references in markdown output would
    // be undefined and would vary accross platforms and program executions.
    // It's also important to compare by a distinct glossary path rather than
    // just the glossary file name because it's likely there will be projects
    // with multiple glossaries in different folders but all named 'glossary.md'.
    byDefinition() {
        const strComparator = collator.compare;
        let terms = Object.keys(this._byAnchor).sort(strComparator);
        let result = [];
        for (let i = 0, len = terms.length; i < len; i++) {
            result.push(this._byAnchor[terms[i]].sort(termComparator));
        }

        return result;
    }

    /**
     * Returns terms in a stable order if the same term exists more than once
     * in different glossaries.
     */
    inOrder() {
        return this._byOccurrence.sort(termComparator);
    }
}
module.exports = Dictionary;
