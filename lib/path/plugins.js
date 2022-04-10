import { visit } from "unist-util-visit";
import { toReproducablePath } from "./tools.js";

export function reproducablePaths(context) {
    const {outDir} = context.conf;
    return (tree) => {
        visit(tree, ["link", "definition"], (node) => {
            node.url = toReproducablePath(outDir, node.url, "{outDir}");
        });
    };
}

/**
 * @private
 * @param {Context} context
 */
export function pathRewriter(context) {
    const {baseUrl, pathRewrites} = context.conf.linking || {};
    const baseUrlSize = `${baseUrl}`.length;

    const rules = Object.keys(pathRewrites);
    if (rules.length === 0) {
        return (tree) => tree;
    } else {
        const filter = node => !!node.url;
        return (tree) => visit(tree, filter, node => {
            const url = `${node.url}`;
            const isUrl = /:\/\//.test(url);
            const isBasedUrl = baseUrl && url.substring(0, baseUrlSize) === baseUrl;
            if ( !isUrl || isBasedUrl ) {
                // Do not rewrite URLs unless they are based on `baseUrl`.
                node.url = rules.reduce((prevResult, searchKey) => {
                    return prevResult.replace(new RegExp(searchKey), pathRewrites[searchKey]);
                }, url);
            }
            return node;
        });
    }
}
