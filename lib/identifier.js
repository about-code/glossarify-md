import BananaSlug from "github-slugger";
import crypto from "node:crypto";
import { visit } from "unist-util-visit";
import { getNodeText } from "./ast/tools.js";
import { getUrlPath } from "./path/tools.js";

/**
 * @typedef {import("./model/context.js").Context } Context
 */

/**
 * Plug-in to generate heading identifiers using either github-slugger
 * or a cryptographic hash algorithm.
 *
 * For terms repeated once or more within a single file 'github-slugger'
 * generates identifiers which are unique within that file. The cryptographic
 * alternatives will generate a hash which is unique accross a set of files by
 * using a function
 *
 *    hash(algorithm, termUrl)
 *
 * where 'termUrl' follows a template {baseUrl}{filepath}#{github-slugger(term)}.
 * The {baseUrl} component is optional. Note that the hash can not be considered
 * a hash of a term's URI because a term URI may be built *from the hash* rather
 * than *being hashed*.
 *
 * Custom identifiers (e.g. provided using pandoc syntax) will take precedence
 * over auto generated IDs. Their uniqueness must be ensured by the user.
 *
 * @param {{ context: Context }} args
 */
export function identifier(args) {
    const { context } = args;
    const { linking, outDir } = context.conf;
    const algorithm = /^([a-zA-Z0-9]+)-?([0-9]{0,4})$/.exec(linking.headingIdAlgorithm);
    const termHost = linking.baseUrl || "term://glossarify.md/";
    const slugs = new BananaSlug();
    return (tree, vFile) => {
        slugs.reset();

        // Prepending a file path makes slugs unique IDs within the fileset.
        // Only required in hash functions but calculated once per file rather
        // than with every node.
        const termUrlPath = getUrlPath(outDir, vFile).replace(vFile.extname, "");
        const termUrl = `${termHost}${termUrlPath}`;
        visit(tree, "heading", (node) => {
            let id = "";
            let idPlain = "";
            if (node.data && node.data.id) {
                // CUSTOM-ID
                id = node.data.id;
            } else if (algorithm && algorithm[1] !== "github") {
                // HASH
                const hashFn = `${algorithm[1]}`.toLowerCase();
                const slug = slugs.slug(getNodeText(node));
                const url = (new URL(`${termUrl}#${slug}`)).toString();
                try {
                    // Prefix for HTML(4) compatibility which expects ID attrs to begin
                    // with a letter
                    id = `${hashFn}:${crypto.createHash(hashFn)
                        .update(url)
                        .digest("hex")
                        .toString()
                        .substr(0, algorithm[2] || undefined )}`;
                    idPlain = url;
                } catch (err) {
                    /* DEFAULT */
                    id = slug;
                }
            } else {
                // DEFAULT (GitHub-Slugs)
                id = slugs.slug(getNodeText(node));
            }

            if (!node.data) {
                node.data = { id, idPlain };
            }
            if (!node.data.hProperties) {
                node.data.hProperties = { id };
            }
        });
        return tree;
    };
}
