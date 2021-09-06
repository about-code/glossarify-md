import { fromMarkdown } from "mdast-util-wiki-link";
import { syntax } from "micromark-extension-wiki-link";

/**
 *
 */
const SYMBOL = "pandoc-heading-id";
export const PandocHeadingIdNode = {
    type: SYMBOL
    ,syntax
    ,fromMarkdown
    ,toMarkdown: function () {
        return {
            handlers: { [SYMBOL]: (node) => ` {#${node.id}}` }
        };
    }
};
