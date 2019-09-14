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
        if(this._byAnchor[anchor]) {
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
        return this._byAnchor[anchor].sort(getTermComparator('en')) || [];
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
        const termComparator = getTermComparator('en');
        const strComparator = (a1, a2) => a1.localeCompare(a2, 'en');

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
        return this._byOccurrence.sort(getTermComparator('en'));
    }
}

function getTermComparator(locale, boolDesc) {
    const ascOrDesc = boolDesc ? -1 : 1;
    return function compare(t1, t2) {
        let primaryOrder = t1.term.localeCompare(t2.term, locale) * ascOrDesc;
        if (primaryOrder === 0) {
            return t1.glossary.file.localeCompare(t2.glossary.file, locale) * ascOrDesc;
        } else {
            return primaryOrder;
        }
    }
}

module.exports = Dictionary;
