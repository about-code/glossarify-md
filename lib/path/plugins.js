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
