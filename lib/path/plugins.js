import proc from "node:process";
import { visit } from "unist-util-visit";

const CWD = proc.cwd();
export function reproducablePaths() {
    return (tree) => {
        visit(tree, ["link", "definition"], (node) => {
            node.url = node.url.replace(CWD, "{CWD}");
        });
    };
}
