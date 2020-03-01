const path = require("path");
const proc = require("process");
const GitHubSlugger = require("github-slugger");

const Context = require("./model/context");
const toForwardSlash = require("./path/tools").toForwardSlash;
const reader = require("./reader");
const writer = require("./writer");

const CWD = proc.cwd();

function run(opts) {
    const context = new Context({opts: opts});
    prepare(context)
        .then(context => writer.copyBaseDirToOutDir(context))
        .then(context => reader.readGlossaries(context))
        .then(context => reader.readDocumentFiles(context))
        .then(context => Promise
            .all([
                writer.writeOutput(context)
                ,writer.writeIndex(context)
                ,writer.writeListOfFigures(context)
                ,writer.writeListOfTables(context)
                ,writer.writeListsOfAny(context)
            ])
            .then(() => context)
        )
        .then(context => Promise
            .all([
                writer.writeReport(context)
                ,writer.writeTestOutput(context)
            ])
            .then(() => context)
        )
        .catch(err => console.error(err) && proc.exit(1));
}

/**
 * Provide internally used slugifier to allow for better integration with vuepress
 * See also https://github.com/about-code/glossarify-md/issues/27.
 */
function getSlugger() {
    return (url) => {
        const slugger = new GitHubSlugger();
        return slugger.slug(url);
    };
    // Implementation note:
    // GitHubSlugger is stateful to be able to create unique names if the same
    // anchor/headline/term occurs twice on a *single page*. But slugify function
    // provided to vuepress will be invoked for different pages of a project.
    // They would appear to GitHubSlugger as being a single page / namespace if
    // we didn't create a new GitHubSlugger with every call, here. Rather than
    // creating a new instance we could also close over a single instance and
    // call 'slugger.reset()'. But, we decided to create an instance in the
    // function body which can be garbage collected immediately after the call.
}

/**
 * @private
 * @param {Context} context
 * @returns {Promise<Context>} context
 */
function prepare(context) {
    const {opts} = context;
    const baseDir = opts.baseDir
        = toForwardSlash(path.resolve(CWD, opts.baseDir));
    opts.outDir
        = toForwardSlash(path.resolve(baseDir, opts.outDir));

    if (! opts.indexing )  {
        opts.indexing = {};
    }
    if (opts.indexing.groupByHeadingDepth === undefined) {
        opts.indexing.groupByHeadingDepth = 6;
    }
    if (! opts.generateFiles ) {
        opts.generateFiles = {};
    }
    if (! opts.glossaries ) {
        opts.glossaries = {};
    }

    return Promise.resolve(context);
}

module.exports = { run, getSlugger };
