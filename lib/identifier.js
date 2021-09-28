import BananaSlug from "github-slugger";
import crypto from "node:crypto";
import { visit } from "unist-util-visit";
import { getNodeText } from "./ast/tools.js";
import { urlPath } from "./path/tools.js";

/**
 * Unified plug-in to generate heading identifiers using either github-slugger
 * or a cryptographic hash algorithm.
 *
 * @param {{ algorithm: string }} args Algorithm
 */
export function identifier(args) {
    const { context } = args;
    const { linking, outDir } = context.conf;
    const baseUrl = linking.baseUrl;
    const slugs = new BananaSlug();
    const algorithm = /^([a-zA-Z0-9]+)-?([0-9]{0,4})$/.exec(linking.headingIdAlgorithm);

    let termHost = baseUrl || "term://glossarify.md";
    return (tree, vFile) => {
        slugs.reset();
        const termHostPath = `${termHost}/${urlPath(outDir, vFile)}`;
        visit(tree, "heading", (node) => {
            let id = "";
            if (node.data && node.data.id) {
                // CUSTOM-ID
                id = node.data.id;
                node.hasCustomId = true;
            } else if (algorithm && algorithm[1] !== "github") {
                // HASH
                const algo = `${algorithm[1]}`.toLowerCase();
                const url = (new URL(`${termHostPath}#${getNodeText(node)}`)).toString();
                try {
                    // Prefix for HTML(4) compatibility which expects ID attrs to begin
                    // with a letter
                    id = `${algo}-${crypto.createHash(algo)
                        .update(url)
                        .digest("hex")
                        .toString()
                        .substr(0, algorithm[2] || undefined )}`;
                } catch (err) {
                    /* DEFAULT */
                    id = slugs.slug(getNodeText(node));
                }
                node.hasCustomId = false;
            } else {
                // DEFAULT (GitHub-Slugs)
                id = slugs.slug(getNodeText(node));
                node.hasCustomId = false;
            }

            if (!node.data) {
                node.data = { id };
            }
            if (!node.data.hProperties) {
                node.data.hProperties = { id };
            }
        });
        return tree;
    };
}
