const Term = function(data) {
    this.term = "";
    this.shortDesc = "";
    this.longDesc = "";
    this.anchor = "";
    this.regex = "";
    this.glossaryFile = "";
    if (data) {
        Object.assign(this, data);
    }
}
module.exports = Term;
