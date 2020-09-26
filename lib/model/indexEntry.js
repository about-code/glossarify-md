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
};
