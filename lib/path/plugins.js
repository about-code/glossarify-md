import { visit } from "unist-util-visit";
import { toReproducablePath } from "./tools.js";

/**
 * Factory which creates a unified-engine plug-in (= function) to be
 * passed to the engine's use() function. The plug-in returns an AST
 * tree visitor for rewriting the 'url' property mdAST nodes of type
 * 'link' and 'definition' such that path segments will be eliminated
 * that vary between systems on which file processing is carried out.
 *
 * It is intended to be used for testing the tool itself and to
 * guarantee reproducable results on different platforms and systems.
 */
export function withReproducablePaths(context) {
    const {outDir} = context.conf;
    return () => (tree) => {
        visit(tree, ["link", "definition"], (node) => {
            node.url = toReproducablePath(outDir, node.url, "{outDir}");
        });
    };
}

/**
 * Factory which creates a unified-engine plug-in (= function) to be
 * passed to the engine's use() function. The plug-in returns an AST
 * tree visitor for rewriting URLs and paths of mdAST nodes with a
 * 'url' property based on the 'linking.pathRewrites' config option.
 *
 * @private
 * @param {Context} context
 */
export function withPathRewriter(context) {
    const {baseUrl, pathRewrites} = context.conf.linking || {};
    const baseUrlSize = `${baseUrl}`.length;
    const rules = Object.keys(pathRewrites);
    if (rules.length === 0) {
        return () => (tree) => tree;
    } else {
        const filter = (node) => !!node.url;
        const visitor = (node) => {
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
        };
        return () => (tree) => visit(tree, filter, visitor);
    }
}
