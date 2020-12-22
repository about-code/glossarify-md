const phrasing = require("mdast-util-to-markdown/lib/util/container-phrasing");
const SYMBOL = Symbol("term-occurrence");

/**
 * AST node type "term-occurrence" being inserted anywhere a term having been
 * defined in a "term-definition" is being used in text.
 */
class TermOccurrenceNode {

    /**
     * @param {Partial<TermOccurrenceNode>} data
     */
    constructor(data) {
        this.type = SYMBOL;

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
}

TermOccurrenceNode.type = SYMBOL;
TermOccurrenceNode.syntax = () => {};
TermOccurrenceNode.fromMarkdown = () => {};
TermOccurrenceNode.toMarkdown = () => {
    return {
        handlers: { [SYMBOL]: mdAstNodeToStringHandler }
    };
};

function mdAstNodeToStringHandler(node, _, context) {
    // This purely semantic node type has no particular serialization itself.
    // But it has children of type 'link' which need to be serialized and which
    // belong to "PhrasingContent" in the mdAST content model. So we use
    // phrasing() for them.
    // https://github.com/syntax-tree/mdast#phrasingcontent
    const exit = context.enter(TermOccurrenceNode.type);
    const children = phrasing(node, context, { before: "", after: ""});
    exit();
    return children;
}

module.exports.TermOccurrenceNode = TermOccurrenceNode;
