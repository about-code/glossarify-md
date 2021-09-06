import { visit } from "unist-util-visit";

/**
 * Unified plug-in to add pandoc-style heading identifiers {#...}.
 */
export function pandoc_heading_append_id() {
    return (tree) => {
        visit(tree, "heading", (headingNode) => {
            if (headingNode.data.id) {
                const id = headingNode.data.id;
                headingNode.children.push({
                    type: "pandoc-heading-id"
                    , id: id
                });
            }
        });
        return tree;
    };
}

/**
 * MIT License
 *
 * Copyright (c) imcuttle <moyuyc95@gmail.com>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export function pandoc_heading_parse_id() {
    return function (node) {
        visit(node, "heading", node => {
            let lastChild = node.children[node.children.length - 1];
            if (lastChild && lastChild.type === "text") {
                let string = lastChild.value.replace(/ +$/, "");
                let matched = string.match(/ {#([^]+?)}$/);

                if (matched) {
                    let id = matched[1];
                    if (id.length) {
                        if (!node.data) {
                            node.data = {};
                        }
                        if (!node.data.hProperties) {
                            node.data.hProperties = {};
                        }
                        node.data.id = node.data.hProperties.id = id;

                        string = string.substring(0, matched.index);
                        lastChild.value = string;
                    }
                }
            }
        });
    };
}
