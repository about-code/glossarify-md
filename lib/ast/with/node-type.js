export function withNodeType(nodeType) {
    return function () {
        // https://github.com/unifiedjs/unified#processordatakey-value
        const data = this.data();
        add(data, "micromarkExtensions", nodeType.syntax());
        add(data, "fromMarkdownExtensions", nodeType.fromMarkdown());
        add(data, "toMarkdownExtensions", nodeType.toMarkdown());
        return (tree) => tree;
    };
}
function add(data, field, value) {
    if (!value) {
        return;
    }
    if (data[field]) {
        data[field].push(value);
    } else {
        data[field] = [value];
    }
}
