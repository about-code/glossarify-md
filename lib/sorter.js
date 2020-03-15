const path = require("path");
const {getNodeText} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");
const CWD = require("process").cwd();
const api = {};

/* @private
 * @param {{context: Context}} opts
 */
api.sorter = function(opts) {
    const {files} = opts || [];
    const byPath = files.reduce((result, curr) => {
        if (curr.sort) {
            const vFilePath = toForwardSlash(curr.file)
                .replace("../", "")
                .replace("./", "");
            result[vFilePath] = curr;
        }
        return result;
    }, {})

    return (tree, vFile) => {
        const p = toForwardSlash(vFile.path);
        const conf = byPath[p];
        if (conf) {
            return sort(tree, conf.sort, conf.locale || "en");
        }
        return tree;
    };
};

function sort(tree, order, locale) {
    const sections = [];
    let beginAt = -1; // index position of first non-title heading
    const sign = order === "desc" ? -1 : 1;
    tree.children.forEach((node, index) => {
        if (node.type === "heading") {
            if (node.depth > 1 && beginAt === -1) {
                beginAt = index;
            }
            if (beginAt !== -1) {
                sections.push({
                    type: "section",
                    title: getNodeText(node),
                    children: [ node ]
                });
            }
        } else if (beginAt != -1) {
            sections[sections.length - 1].children.push(node);
        } else {
            return;
        }
    });
    sections.sort((s1, s2) => sign * s1.title.localeCompare(s2.title, locale));
    tree.children.splice(beginAt);
    sections.forEach(section => {
        tree.children = tree.children.concat(section.children);
    });
    return tree;
}

module.exports = api;
