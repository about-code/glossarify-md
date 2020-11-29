module.exports.IndexEntry = class IndexEntry {

    constructor(data) {
        this.id = "";
        this.node = null;
        this.file = "";
        this.parent = null;
        this.headingNode = null;
        this.groupHeadingNode = null;
        Object.assign(this, data);
    }

    compare(other) {
        // collections/sorted-set requirement:
        // MUST NOT return 0 in order to guarantee a predictable strict order.
        const _default = +1;
        if (this.sortFn) {
            return this.sortFn.call(null, this, other) || _default;
        } else {
            return this.id - other.id || _default;
        }
    }
};
