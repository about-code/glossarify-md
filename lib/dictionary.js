class Dictionary {
    constructor() {
        this._byAnchor = {};
        this._byOccurrence = [];
    }

    add(term) {
        this._byOccurrence.unshift(term);
        const anchor = term.anchor;
        /**
         * The anchor is better suited as a key, since it is sluggified
         * for use in URLs, thus only contains a limited set of characters.
         */
        if(this._byAnchor[anchor]) {
            this._byAnchor[anchor].unshift(term);
        } else {
            this._byAnchor[anchor] = [term];
        }
    }

    /**
     * Returns the most recently added term or null if none was added so far.
     */
    getLatest() {
        return this._byOccurrence[0];
    }

    /**
     * Returns an array of all definitions of a term when defined in multiple
     * glossaries. If a term was only defined once the array only contains a
     * single item.
     *
     * @param {*} anchor
     */
    byAnchor(anchor) {
        return this._byAnchor[anchor] || [];
    }

    byOccurrence() {
        return this._byOccurrence;
    }

    /**
     * Returns a two-dimentional array of term definitions where the first
     * dimension represents a term and the second all its definitions in
     * particular glossaries.
     */
    byDefinition() {
        return Object.values(this._byAnchor);
    }
}

module.exports = Dictionary;
