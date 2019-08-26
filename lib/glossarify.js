const path = require("path");
const proc = require("process");
const reader = require("./reader");
const linker = require("./linker");
const writer = require("./writer");

const api = {};
const CWD = proc.cwd();

api.glossarify = function(opts) {
    const context = {
        opts: opts,
        terms: [],
        vFiles: [],
        glossaries: {}
    };
    prepare(context)
        .then(context => reader.readTermDefinitions(context))
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
    const baseDir = opts.baseDir = path.resolve(CWD, opts.baseDir);
    const outDir  = opts.outDir  = path.resolve(baseDir, opts.outDir);

    // Internally use a glossaries context object with keys being the glossary
    // file path. This allows to look up the glossary config by vFile metadata
    // when proccesing a glossary file ( see terminator() ).
    opts.glossaries.forEach(conf => {
        conf.file = conf.file || path.resolve(baseDir, "glossary.md");
        conf.basePath = path.resolve(baseDir, conf.file);
        conf.outPath  = path.resolve(outDir,  conf.file);
        context.glossaries[conf.basePath] = conf;
    });
    return Promise.resolve(context);
}

module.exports = api;
