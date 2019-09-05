class Glossary {
    constructor (data) {
        this.file     = data.file     || "";
        this.vFile    = data.vFile    || null;
        this.termHint = data.termHint || "";
        this.basePath = data.basePath || "";
        this.outPath  = data.outPath  || "";
    }
    toJSON() {
        return {
            file: this.file,
            termHint: this.termHint,
            basePath: this.basePath,
            outPath: this.outPath,
        };
    }
}

module.exports = Glossary;
