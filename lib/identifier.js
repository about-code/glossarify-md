import BananaSlug from "github-slugger";
import crypto from "node:crypto";
import { visit } from "unist-util-visit";
import { getNodeText } from "./ast/tools.js";
import { getVFilePath } from "./path/tools.js";

/**
 * Unified plug-in to generate heading identifiers using either github-slugger
 * or a cryptographic hash algorithm.
 *
 * @param {{ algorithm: string }} args Algorithm
 */
export function identifier (args) {
    const slugs = new BananaSlug();
    const algorithm = /^([a-zA-Z0-9]+)-?([0-9]{0,4})$/.exec(args.algorithm);
    return (tree, vFile) => {
        slugs.reset();
        visit(tree, "heading", (node) => {
            let id = "";
            if (node.data && node.data.id) {
                id = node.data.id;
            } else if (algorithm && algorithm[0] !== "github") {
                try {
                    // Prefix for HTML(4) compatibility which expects ID attrs to begin
                    // with a letter
                    id = `id-${crypto.createHash(algorithm[1])
                        .update(getNodeText(node) + getVFilePath(vFile))
                        .digest("hex")
                        .toString()
                        .substr(0, algorithm[2] || undefined )}`;
                } catch (err) {
                    id = slugs.slug(getNodeText(node));
                }
            } else {
                id = slugs.slug(getNodeText(node));
            }
            if (!node.data) {
                node.data = {};
            }
            if (!node.data.hProperties) {
                node.data.hProperties = {};
            }
            node.data.id = node.data.hProperties.id = id;
        });
        return tree;
    };
}