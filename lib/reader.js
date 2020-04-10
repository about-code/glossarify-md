const path = require("path");
const unified = require("unified");
const unifiedNgin = require("unified-engine");
const remark_parse = require("remark-parse");
const remark_slug = require("remark-slug");
const remark_link_headings = require("remark-autolink-headings");
const remark_stringify = require("remark-stringify");
const remark_ref_links = require("remark-reference-links");

const {printAst, noopCompiler} = require("./ast/tools");
const {toForwardSlash} = require("./path/tools");
const {counter} = require("./counter");
const {indexer} = require("./indexer");
const {indices: termIndices} = require("./index/terms");
const {indices: imgIndices} = require("./index/figures");
const {indices: tableIndices} = require("./index/tables");
const {indices: anyCssClassIndices} = require("./index/any");
const {linker} = require("./linker");
const {sorter} = require("./sorter");
const {terminator} = require("./terminator");
const Glossary = require("./model/glossary");

const api = {};

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
 * Reads glossary markdown files into a dictionary.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
api.readGlossaries = function(context) {
    const {
        baseDir, outDir, glossaries, keepRawFiles, excludeFiles,
        experimentalFootnotes, dev
    } = prepare(context).opts;

    return new Promise((resolve, reject) => {
        unifiedNgin(
            {
                processor: unified()
                    .use(remark_parse, { footnotes: experimentalFootnotes })
                    .use(printAst, { match: dev.printInputAst })  // Might be regex. /.*\/table\.md/g;
                    .use(remark_slug)
                    .use(remark_link_headings, {behavior: "wrap"})
                    .use(terminator, { context: context })
                    .use(printAst, { match: dev.printOutputAst }) // Might be regex. /.*\/table\.md/g;
                    .use(noopCompiler)
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
                ,extensions: ["md", "markdown", "mkd", "mkdn", "mkdown"]
                ,alwaysStringify: true
                ,output: false
                ,out: false
                ,color: true
                ,silent: false
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
        excludeFiles, experimentalFootnotes, dev
    } = context.opts;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = {
            processor: unified()
                .use(remark_parse, { footnotes: experimentalFootnotes })
                .use(printAst, { match: dev.printInputAst })  // Might be regex. /.*\/table\.md/g;
                .use(sorter, { context })
                .use(remark_slug)
                .use(linker,  { context })
                .use(remark_ref_links)
                .use(remark_link_headings, {behavior: "wrap"})
                .use(indexer, {
                    context: context
                    ,indices: [
                        ...termIndices
                        ,...imgIndices
                        ,...tableIndices
                        ,...anyCssClassIndices
                    ]
                })
                .use(counter, { context })
            //  .use(printAst, { match: dev.printOutputAst })
                .use(noopCompiler)
                .use(remark_stringify)
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
