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
const {indices: termIndices} = require("./index/terms");
const {indices: anchorIndices} = require("./index/anchors");
const {linker} = require("./linker");
const {sorter} = require("./sorter");
const {terminator} = require("./terminator");
// Tools
const {printAst} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");
// Model
const {Glossary} = require("./model/glossary");
// ----


const api = {};
const remarkStringifyOpts = {
    bullet: "-"
    ,emphasis: "_"
    ,quote: "\""
    // ,strong: "_"
    // ,fence: '~'
    // ,fences: true
    // ,incrementListMarker: false
};

module.exports.remarkStringifyOpts = remarkStringifyOpts;

/**
 * @param {Context} context
 * @returns {Context}
 */
function prepare(context) {
    const {glossaries, baseDir, outDir} = context.opts;
    // Instantiate `context.opts.glossaries` into an array of type `Glossary[]`.
    // Thereby set up a `context.glossaries` map with keys being a glossary
    // file path and value being a `Glossary` instance in order to access
    // a `Glossary` instance by path. The latter allows to look up the glossary
    // config by vFile metadata when proccesing glossary files with unifiedjs.
    context.opts.glossaries = glossaries.map(conf => {
        const g = new Glossary(conf);
        g.file = conf.file || path.join(baseDir, "glossary.md");
        g.basePath = toForwardSlash(path.resolve(baseDir, conf.file));
        g.outPath  = toForwardSlash(path.resolve(outDir,  conf.file));
        context.glossaries[g.basePath] = g;
        return g;
    });
    return context;
}


/**
 * Reads glossary files to index terms defined in there.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
api.readGlossaries = function(context) {
    const {
        baseDir, outDir, glossaries, keepRawFiles, excludeFiles, dev
    } = prepare(context).opts;

    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: unified()
                    .use(withNodeType(TocInstructionNode))
                    .use(withNodeType(TermDefinitionNode))
                    .use(withNodeType(TermOccurrenceNode))
                    .use(remark_parse) // parser
                    .use(remark_stringify, remarkStringifyOpts) // compiler
                    .use(printAst, { match: dev.printInputAst })  // Might be regex. /.*\/table\.md/g;
                    .use(remark_gfm)
                    .use(remark_pandoc_heading_id)
                    .use(remark_slug_heading_id)
                    .use(remark_link_headings, {behavior: "wrap"})
                    .use(terminator, { context: context })
                    .use(indexer, {
                        context: context
                        ,indices: termIndices
                    })
                    .use(printAst, { match: dev.printOutputAst }) // Might be regex. /.*\/table\.md/g;
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
                // ,extensions: ["md", "markdown", "mkd", "mkdn", "mkdown"]
                ,alwaysStringify: false
                ,output: false
                ,out: false
                ,color: true
                ,silent: true
            },
            (err) => err ? reject(err) : resolve(context)
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
        baseDir, outDir, includeFiles, keepRawFiles,
        excludeFiles, dev
    } = context.opts;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = {
            processor: unified()
                .use(withNodeType(TocInstructionNode))
                .use(withNodeType(TermDefinitionNode))
                .use(withNodeType(TermOccurrenceNode))
                .use(remark_parse) // parser
                .use(remark_stringify, remarkStringifyOpts) // compiler
                .use(anchorizer, { context })
                .use(printAst, { match: dev.printInputAst })  // Might be regex. /.*\/table\.md/g;
                .use(sorter, { context })
                .use(remark_footnotes, {inlineNotes: true})
                .use(remark_pandoc_heading_id)
                .use(remark_slug_heading_id)
                .use(remark_gfm)
                .use(linker,  { context })
                .use(remark_ref_links)
                .use(remark_link_headings, {behavior: "wrap"})
                .use(indexer, {
                    context: context
                    ,indices: [
                        ...termIndices
                        ,...anchorIndices
                    ]
                })
                .use(counter, { context })
            //  .use(printAst, { match: dev.printOutputAst })
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
            ,extensions: ["md", "markdown", "mkd", "mkdn", "mkdown"]
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: false
        };
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
