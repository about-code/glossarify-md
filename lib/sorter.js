const {getNodeText} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");
const {collator} = require("./text/collator");
const api = {};

/* @private
 * @param {{context: Context}} opts
 */
api.sorter = function(opts) {
    const {glossaries} = opts.context.opts || [];
    const files = glossaries.reduce((result, glossary) => {
        if (glossary.sort) {
            const vFilePath = toForwardSlash(glossary.file)
                .replace("../", "")
                .replace("./", "");
            result[vFilePath] = glossary;
        }
        return result;
    }, {});

    return (tree, vFile) => {
        const p = toForwardSlash(vFile.path);
        const glossary = files[p];
        if (glossary) {
            return sort(tree, glossary.sort);
        }
        return tree;
    };
};

function sort(tree, order) {
    const sign = order === "desc" ? -1 : 1;
    const sections = [];
    let beginAt = -1; // index position of first non-title heading

    // Identify sections
    tree.children.forEach((node, index) => {
        if (node.type === "heading") {
            if (node.depth > 1 && beginAt === -1) {
                beginAt = index;
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
        } else {
            return;
        }
    });

    // Sort sections by heading
    sections.sort((s1, s2) => {
        return sign * collator.compare(s1.title, s2.title);
    });

    // Update AST
    tree.children.splice(beginAt);
    sections.forEach(section => {
        tree.children = tree.children.concat(section.children);
    });
    return tree;
}

module.exports = api;
