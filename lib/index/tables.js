const {root, paragraph, text, heading, brk, link, list, listItem } = require("mdast-builder");
const {getFileLinkUrl} = require("../path/tools");
const {getLinkUrl, getNodeText, getTableHeaders} = require("../ast/tools");
const {getIndex, group, byGroupHeading} = require("../indexer");

const api = {};
const TABLE_LABEL_REGEXP = /<!-- table: (.*) -->/;
const TABLE_LABEL_REGEXP2 = /(.*):(\s|\n|$)/;

/**
 * @typedef { import('./model/context') } Context
 * @typedef { import('./indexer').IndexEntry } IndexEntry
 * @typedef { import('./indexer').Index } Index
 */

api.indices = [
    {
        id: "index/tables"
        ,filterFn: (indexEntry) => {
            const node = indexEntry.node;
            if (node.type === "table") {
                return true;
            } else if (node.type === "html" && node.value.match(TABLE_LABEL_REGEXP)) {
                return true;
            } else if (node.type === "emphasis" && getNodeText(node.children[0]).match(TABLE_LABEL_REGEXP2)) {
                return true;
            }
        }
        ,keyFn: (indexEntry) => {
            const file = indexEntry.file;
            const node = indexEntry.node;
            if (node.type === "table") {
                return `${file}#${node.position.start.line}`;
            } else if (node.type === "html") {
                return `${file}#${node.position.start.line + 1}`;
            } else if (node.type === "emphasis") {
                return `${file}#${node.position.start.line + 2}`;
            }
            // Implementation Note:
            // In order to identify a descriptive label for a markdown table, we
            // attempt to group the table node with descriptive nodes by projecting
            // the line numbers of descriptive nodes onto the line number where
            // we *assume* the actual table node to be (+1 line or +2 lines below)
            //
            // However, this is not guaranteed to always produce groups with a
            // table. For example we might find an emphasis node not followed by
            // a table at all. Then we have a group without a table. Those groups
            // must be filtered and ignored when processing the index.
        }
    }
];

/**
 * Returns the markdown abstract syntax tree that is to be written to the file
 * configured via 'generateFiles.listOfTables' config.
 *
 * Given, documents satisfy a particular syntax, then descriptive labels for
 * (syntactically) anonymous tables will be inferred as follows:
 *
 * #### Syntax 1: Using a descriptive html comment invisible in rendered output
 *
 * ```
 * <!-- table: Articles -->
 * | Article ID | Description | Price  |
 * | ---------- | ----------- | ------ |
 * | 12345678   | Football    | $44.50 |
 * ```
 *
 * #### Syntax 2: Using colon-terminated, emphasized paragraph visible in rendered output
 *
 * ```
 * This is a preceding paragraph just being there to highlight that the actual
 * table label must be surrounded by newlines and be a distinct paragraph.
 *
 * *Articles:*
 *
 * | Article ID | Description | Price  |
 * | ---------- | ----------- | ------ |
 * | 12345678   | Football    | $44.50 |
 * ```
 *
 * @param {Context} context
 * @returns {Node} mdast tree
 */
api.getAST = function(context) {
    const {generateFiles, indexing} = context.opts;
    const {groupByHeadingDepth} = indexing;
    const {title} = generateFiles.listOfTables;
    const tables = selectTablesFromIndex(context);

    let tree = [
        heading(1, text(title || "Tables"))
    ];
    if (! groupByHeadingDepth || groupByHeadingDepth < 0) {
        tree.push(getListOfTablesAst(context, tables));
    } else {
        tree.push(getTablesBySectionAst(context, tables));
    }
    return root(tree);
};

/**
 * @param {Context} context
 * @param {IndexEntry[]} tables
 */
function getTablesBySectionAst(context, tables) {
    return paragraph(
        group(tables, byGroupHeading).map((tables) => {
            const groupHeadingNode = tables[0].groupHeadingNode;
            if (! groupHeadingNode) {
                return paragraph([
                    getListOfTablesAst(context, tables)
                    ,brk
                ]);
            } else {
                return paragraph([
                    brk
                    ,heading(groupHeadingNode.depth + 1, // [1]
                        text(getNodeText(groupHeadingNode))
                    )
                    ,brk
                    ,brk
                    ,getListOfTablesAst(context, tables)
                    ,brk
                ]);
            }
        })
    );
    /**
     * Implementation Notes:
     *
     * [1] add +1 to depth of headings referred to in order to keep
     * the title of the generated file the only depth-1 heading
     */
}

/**
 * @param {Context} context
 * @param {IndexEntry[]} tables
 * @returns {Node} mdast tree
 */
function getListOfTablesAst(context, tables) {
    return list(
        "ordered"
        ,tables
            .sort((entry1, entry2) => entry1.id - entry2.id)
            .map((indexEntry) => getListOfTablesItemAst(context, indexEntry))
    );
}

/**
 * @param {Context} context
 * @param {IndexEntry} indexEntry
 * @returns {Node} mdast tree
 */
function getListOfTablesItemAst(context, indexEntry) {
    const {listOfTables} = context.opts.generateFiles;
    const {file: listOfTablesFile} = listOfTables;

    return listItem([
        link(
            getFileLinkUrl(context, listOfTablesFile, indexEntry.file, getLinkUrl(indexEntry.headingNode))
            ,indexEntry.description
            ,text(indexEntry.description)
        )
    ]);
}

/**
 * @returns {IndexEntry[]} index entries for node types "table"
 */
function selectTablesFromIndex() {
    const tableEntries = getIndex("index/tables");
    let tables = [
        ...Object
            .keys(tableEntries)
            .filter(key => tableEntries[key].find(entry => entry.node.type === "table"))   // [1]
            .map(key => mergeTableWithLabel(tableEntries[key]))
    ];
    return tables;

    // Implementation Notes:
    // [1] See implementation note for the index key function, above.
}

function mergeTableWithLabel(indexEntries) {
    const htmlEntry =  indexEntries.filter(x => x.node.type === "html")[0];
    const textEntry =  indexEntries.filter(x => x.node.type === "emphasis")[0];
    const tableEntry = indexEntries.filter(x => x.node.type === "table")[0];
    let label = "";
    if (htmlEntry) {
        // Take table label from html annotation comment
        const matches = htmlEntry.node.value.match(TABLE_LABEL_REGEXP);
        if (matches.length > 1) {
            label = matches[1];
        }
    } else if (textEntry) {
        // Take table label from preceding paragraph
        const matches = getNodeText(textEntry.node).match(TABLE_LABEL_REGEXP2);
        if (matches.length > 1) {
            label = matches[1];
        }
    }
    if (! label) {
        // Try constructing a table label from table headings
        label = getTableHeaders(tableEntry.node)
            .filter(text => !!text)
            .join(", ");
    }
    if (! label) {
        // Use section heading to label the table
        label = getNodeText(tableEntry.headingNode);
    }
    if (! label) {
        // Use file name if none of previous attempts succeeded
        label = `${tableEntry.file}`;
    }
    return {
        ...tableEntry
        , description: label
    };
}

module.exports = api;
