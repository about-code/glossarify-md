import { getNodeText } from "./ast/tools.js";
import { toForwardSlash } from "./path/tools.js";
import { collator } from "./text/collator.js";
import { EXIT, visit } from "unist-util-visit";

/**
 * Factory which creates a unified-engine plug-in (= function) to be
 * passed to the engine's use() function. The plug-in returns an AST
 * tree visitor for sorting Markdown sections alphabetically by their
 * section headings.
 *
 * @private
 * @param {Context} context
 */
export function withSorter(context) {
    const {glossaries} = context.conf || [];
    const files = glossaries.reduce((result, glossary) => {
        if (glossary.sort) {
            const vFilePath = toForwardSlash(glossary.file)
                .replace("../", "")
                .replace("./", "");
            result[vFilePath] = glossary;
        }
        return result;
    }, {});

    return () => (tree, vFile) => {
        const p = toForwardSlash(vFile.path);
        const glossary = files[p];
        if (glossary) {
            visit(tree, "root", (tree) => {
                sort(tree, glossary.sort);
                return EXIT;
            });
        }
        return tree;
    };
}

function sort(tree, order) {
    const sign = order === "desc" ? -1 : 1;
    const sections = [];
    const children = tree.children;

    // 1. Identify sections
    let beginAt = -1; // index position of first non-title heading
    for (let i = 0, len = children.length; i < len; i++) {
        const node = children[i];
        if (node.type === "heading") {
            if (node.depth > 1 && beginAt === -1) {
                beginAt = i;
            }
            if (beginAt !== -1) {
                sections.push({
                    type: "section"
                    ,title: getNodeText(node)
                    ,children: [ node ]
                });
            }
        } else if (beginAt !== -1) {
            sections[sections.length - 1].children.push(node);
        }
    }

    // 2. Sort sections by heading
    sections.sort((s1, s2) => {
        return sign * collator.compare(s1.title, s2.title);
    });

    // 3. Update AST
    tree.children.splice(beginAt);
    for (let i = 0, len = sections.length; i < len; i++) {
        const section = sections[i];
        tree.children = tree.children.concat(section.children);
    }
    return tree;
}
