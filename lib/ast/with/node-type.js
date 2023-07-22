export function withNodeType(nodeTypes) {
    if (! Array.isArray(nodeTypes)) {
        nodeTypes = [nodeTypes];
    }
    return function () {
        // https://github.com/unifiedjs/unified#processordatakey-value
        const data = this.data();
        for (let i = 0, len = nodeTypes.length; i < len; i++) {
            const nodeType = nodeTypes[i];
            add(data, "micromarkExtensions", nodeType.syntax());
            add(data, "fromMarkdownExtensions", nodeType.fromMarkdown());
            add(data, "toMarkdownExtensions", nodeType.toMarkdown());
        }
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
