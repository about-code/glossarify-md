/**
 * @typedef {import('unist').Parent} Node
 * @typedef {import('vfile') VFile
 */

const SYMBOL = "file-node";

/**
 *
 * @implements {Node}
 */
export class FileNode {

    constructor(vFile) {

        /** @type {string} */
        this.type = "file-node";

        /** @type {VFile} */
        this.vFile = vFile;

        /**
         * @type {Node[]}
         */
        this.children = [];

        this.metaTree = {
            type: "meta-root"
            ,children: []
        };
    }
}
FileNode.type = SYMBOL;
FileNode.syntax = () => {};
FileNode.fromMarkdown = () => {};
FileNode.toMarkdown = () => {
    return {
        handlers: { [SYMBOL]: (node, _, context) => {
            const exit = context.enter(FileNode.type);
            const children = context.containerFlow(node, context, { before: "", after: ""});
            exit();
            return children;
        }}
    };
};

FileNode.addMetaTree = (fileNode, metaTreeNode) => {
    if (fileNode.metaTree) {
        fileNode.metaTree.children.push(metaTreeNode);
    }
};

FileNode.asRoot = () => {
    return () => (tree, vFile) => {
        const root = new FileNode(vFile);
        root.children = tree.children.splice(0);
        tree.children.push(root);
        return tree;
    };
};
