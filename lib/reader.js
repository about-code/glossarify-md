const path = require("path");
// UnifiedJS markdown plugins
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const remark_parse = require("remark-parse");
const remark_gfm = require("remark-gfm");
const remark_slug_heading_id = require("remark-slug");
const remark_pandoc_heading_id = require("remark-heading-id");
const remark_link_headings = require("remark-autolink-headings");
const remark_stringify = require("remark-stringify");
const remark_ref_links = require("remark-reference-links");
const remark_footnotes = require("remark-footnotes");

// Our plugins
const {withNodeType} = require("./ast/with/node-type");
const {TocInstructionNode} = require("./ast/with/toc-instruction");
const {TermDefinitionNode} = require("./ast/with/term-definition");
const {TermOccurrenceNode} = require("./ast/with/term-occurrence");
const {counter} = require("./counter");
const {anchorizer} = require("./anchorizer");
const {indexer} = require("./indexer");
const {indexes: termsIndexes} = require("./index/terms");
const {indexes: anchorIndexes} = require("./index/anchors");
const {linker} = require("./linker");
const {sorter} = require("./sorter");
const {terminator} = require("./terminator");
// Tools
const {printAst} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");

const api = {};

/**
 * Reads glossary files to index terms defined in there.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
api.readGlossaries = function(context) {
    const {
        baseDir, outDir, glossaries, keepRawFiles, excludeFiles,
        unified: unifiedConf
    } = context.conf;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = Object.assign({}, unifiedConf, {
            processor: unified()
                .use(withNodeType(TocInstructionNode))
                .use(withNodeType(TermDefinitionNode))
                .use(withNodeType(TermOccurrenceNode))
                .use(remark_parse) // parser
                .use(remark_gfm)
                .use(remark_pandoc_heading_id)
                .use(remark_slug_heading_id)
                .use(remark_link_headings, {behavior: "wrap"})
                .use(terminator, { context })
                .use(indexer, { context, indexes: [...termsIndexes] })
            ,cwd: baseDir
            ,files: toForwardSlash(
                glossaries
                    .map(g => g.file)
                    .sort((f1, f2) => f1.localeCompare(f2, "en"))
            )
            ,ignoreName: ".mdignore"
            ,ignorePatterns: [
                toForwardSlash(path.relative(baseDir, outDir))
                ,...toForwardSlash(keepRawFiles)
                ,...toForwardSlash(excludeFiles)
            ]
            ,extensions: [
                // GitHub set of markdown file extensions
                // https://github.com/github/markup/blob/master/lib/github/markup/markdown.rb#L34
                "md", "mkd", "mkdn", "mdwn", "mdown", "markdown"
            ]
            ,alwaysStringify: false
            ,treeOut: false
            ,out: false
            ,output: false
            ,color: true
            ,silent: true
        });
        unifiedNgin(
            unifiedNginConf
            ,(err) => err ? reject(err) : resolve(context)
        );
    });
};


/**
 * Reads the pile of markdown files and replaces plaintext term occurrences with
 * links pointing to the term definition in one or more glossaries.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
api.readDocumentFiles = function(context) {
    const {
        baseDir, outDir, includeFiles, keepRawFiles, excludeFiles, dev,
        unified: unifiedConf
    } = context.conf;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = Object.assign({}, unifiedConf, {
            processor: unified()
                .use(withNodeType(TocInstructionNode))
                .use(withNodeType(TermDefinitionNode))
                .use(withNodeType(TermOccurrenceNode))
                .use(remark_parse) // parser
                .use(remark_stringify) // compiler
                .use(printAst, { match: dev.printInputAst })
                .use(anchorizer, { context })
                .use(sorter, { context })
                .use(remark_gfm)
                .use(remark_pandoc_heading_id)
                .use(remark_slug_heading_id)
                .use(remark_footnotes, {inlineNotes: true})
                .use(linker,  { context })
                .use(remark_ref_links)
                .use(remark_link_headings, {behavior: "wrap"})
                .use(indexer, { context, indexes: [...termsIndexes, ...anchorIndexes ]})
                .use(counter, { context })
                .use(printAst, { match: dev.printOutputAst })
            ,cwd: baseDir
            ,files: [
                ...toForwardSlash(includeFiles)
            ]
            ,ignoreName: ".mdignore"
            ,ignorePatterns: [
                toForwardSlash(path.relative(baseDir, outDir))
                ,...toForwardSlash(keepRawFiles)
                ,...toForwardSlash(excludeFiles)
            ]
            ,extensions: ["md", "mkd", "mkdn", "mdwn", "mdown", "markdown" ]
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: false
        });
        unifiedNgin(unifiedNginConf, (err, statusCode, uContext) => {
            if (err) {
                reject(err);
            } else {
                context.vFiles = [...context.vFiles, ...uContext.files];
                resolve(context);
            }
        });
    });
};


module.exports = api;
