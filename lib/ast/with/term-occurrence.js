const api = {};
/**
 * AST node type "term-occurrence" being inserted anywhere a term having been
 * defined in a "term-definition" is being used in text.
 */
api.TermOccurrence = class TermOccurrence {

    /**
     * @param {Partial<TermOccurrence>} data
     */
    constructor(data) {
        this.type = api.TermOccurrence.type;

        /** @type {Node} */
        this.parent = null;

        /** @type {Node} */
        this.headingNode = null;

        /** @type {Node[]} */
        this.termDefs = [];

        /** @type {string} */
        this.value = "";

        /** @type {Node[]} */
        this.children = [];
        Object.assign(this, data);
    }
};

api.TermOccurrence.type = "term-occurrence";
api.withTermOccurrence = function () {
    registerStringifier(this.Compiler);
    return (tree) => tree;
};

/**
 * Registers node type visitors with the compiler.
 *
 * @param {*} compiler
 */
function registerStringifier(compiler) {
    // Register noop visitors for node types that do not produce visible output
    // (e.g. by the 'remark_stringify' compiler) but which rather exist to
    // augment the AST with informal node types.
    compiler.prototype.visitors[api.TermOccurrence.type] = function(node) {
        return this.all(node).join("");
    };
}

module.exports = api;
