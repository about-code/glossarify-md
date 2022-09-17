/**
 * @typedef {import('./glossary')} Glossary
 */
import { TermDefinition } from "../../model/term-definition.js";

const SYMBOL = "term-definition";
export class TermDefinitionNode extends TermDefinition {
    constructor(data) {
        super(data);
        this.type = SYMBOL;
    }
}

// ========/ micromark | mdast \==========
TermDefinitionNode.type = SYMBOL;
TermDefinitionNode.syntax = () => {};
TermDefinitionNode.fromMarkdown = () => {};
TermDefinitionNode.toMarkdown = () => {
    return {
        handlers: { [SYMBOL]: () => "" }
    };
};
// ========\ micromark | mdast /==========

/**
 * @static
 * @param {Term} t1
 * @param {Term} t2
 */
TermDefinitionNode.compare = TermDefinition.compare;
