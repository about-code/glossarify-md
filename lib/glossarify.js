const path = require("path");
const proc = require("process");
const toForwardSlash = require("./pathplus").toForwardSlash;
const terminator = require("./terminator");
const linker = require("./linker");
const writer = require("./writer");
const Dictionary = require("./dictionary");

const api = {};
const CWD = proc.cwd();

api.glossarify = function(opts) {
    const context = {
        opts: opts,
        terms: new Dictionary(),
        vFiles: [],
        glossaries: {}
    };
    prepare(context)
        .then(context => writer.copyBaseDirToOutDir(context))
        .then(context => {
            // make outDir the new baseDir
            context.baseDir = context.outDir
            return context;
        })
        .then(context => terminator.readTermDefinitions(context))
        .then(context => linker.linkTermOccurrences(context))
        .then(context => writer.writeOutput(context))
        .then(context => writer.writeTestOutput(context))
        .catch(err => console.error(err) && proc.exit(1));
}

/**
 * @private
 * @param {} context
 */
function prepare(context) {
    const {opts} = context;
    const baseDir = opts.baseDir = toForwardSlash(path.resolve(CWD, opts.baseDir));
    const outDir  = opts.outDir  = toForwardSlash(path.resolve(baseDir, opts.outDir));

    // Internally use a glossaries context object with keys being the glossary
    // file path. This allows to look up the glossary config by vFile metadata
    // when proccesing a glossary file ( see terminator() ).
    opts.glossaries.forEach(conf => {
        conf.file = conf.file || path.join(baseDir, "glossary.md");
        conf.basePath = toForwardSlash(path.resolve(baseDir, conf.file));
        conf.outPath  = toForwardSlash(path.resolve(outDir,  conf.file));
        context.glossaries[conf.basePath] = conf;
    });
    return Promise.resolve(context);
}

module.exports = api;
