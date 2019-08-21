const Term = function(data) {
    this.term = "";
    this.hint = "";
    this.shortDesc = "";
    this.longDesc = "";
    this.anchor = "";
    this.regex = "";
    this.glossary = {};
    if (data) {
        Object.assign(this, data);
    }
}
module.exports = Term;
