const path = require("path");
const api = {};

    /**
     * No-op compiler to satisfy unifiedjs
     * @private
     */
api.noopCompiler = function() {
        this.Compiler = function(tree) {
            return tree;
        };
    },

    /**
     * Helper function for debugging purposes.
     * @private
     */
api.printAst = function(regExpOrBool) {
    return () => (tree, file) => {
        if (
            (typeof regExpOrBool === "boolean" && regExpOrBool === true) ||
            (typeof regExpOrBool === "string" &&
                path.resolve(file.dirname, file.basename).match(new RegExp(regExpOrBool))
            )
        ) {
            console.log(`
AST for '${file.path}' matched by '${regExpOrBool}'
└───────────────────────────────────────────────────────────────────────────────┐
${JSON.stringify(tree, null, 4)}
`)
        }
        return tree;
    }
}


module.exports = api;
