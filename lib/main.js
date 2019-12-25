const path = require("path");
const proc = require("process");
const GitHubSlugger = require("github-slugger");

const Context = require("./context");
const Glossary = require("./glossary");
const toForwardSlash = require("./pathplus").toForwardSlash;
const glossarifier = require("./glossarifier");
const linker = require("./linker");
const writer = require("./writer");
const Dictionary = require("./dictionary");

const CWD = proc.cwd();

function run(opts) {
    const context = new Context({opts: opts});
    prepare(context)
        .then(context => writer.copyBaseDirToOutDir(context))
        .then(context => glossarifier.readGlossaries(context))
        .then(context => linker.linkTermOccurrences(context))
        .then(context => writer.writeOutput(context))
        .then(context => writer.writeIndex(context))
        .then(context => writer.writeReport(context))
        .then(context => writer.writeTestOutput(context))
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
    const baseDir = opts.baseDir = toForwardSlash(path.resolve(CWD, opts.baseDir));
    const outDir  = opts.outDir  = toForwardSlash(path.resolve(baseDir, opts.outDir));
    return Promise.resolve(context);
}

module.exports = { run, getSlugger };