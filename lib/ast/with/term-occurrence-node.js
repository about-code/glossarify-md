import { TermOccurrence } from "../../model/term-occurrence.js";


const SYMBOL = "term-occurrence";

/**
 * A node of type "term-occurrence" is being inserted into an AST anywhere
 * a term was found for which a "term-definition" exists.
 *
 * @property {string} type Node type identifier.
 * @property {Node[]} children Abstract Syntax Tree children, e.g. the actual link node produced for a term occurrence.
 */
export class TermOccurrenceNode extends TermOccurrence {
    constructor(data) {
        super(data);
        this.type = SYMBOL;
        this.children = data.children || [];
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
    const children = context.containerPhrasing(node, context, { before: "", after: ""});
    exit();
    return children;
}
