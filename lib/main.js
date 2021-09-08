import GitHubSlugger from "github-slugger";
import proc from "process";
import { Context } from "./model/context.js";
import {
    readDocumentFiles,
    readGlossaries
} from "./reader.js";
import { init as initCollator } from "./text/collator.js";
import {
    copyBaseDirToOutDir,
    writeDocumentFiles,
    writeIndexFiles,
    writeListFiles,
    writeReport,
    writeTestOutput
} from "./writer.js";


export function run(conf) {
    const context = new Context(conf);
    prepare(context)
        .then(context => copyBaseDirToOutDir(context))
        .then(context => readGlossaries(context))
        .then(context => readDocumentFiles(context))
        .then(context => Promise
            .all([
                writeDocumentFiles(context)
                ,writeIndexFiles(context)
                ,writeListFiles(context)
            ])
            .then(() => context)
        )
        .then(context => Promise
            .all([
                writeReport(context)
                ,writeTestOutput(context)
            ])
            .then(() => context)
        )
        .catch(err => console.error(err) && proc.exit(1));
}

/**
 * Provide internally used slugifier to allow for better integration with vuepress
 * See also https://github.com/about-code/glossarify-md/issues/27.
 */
export function getSlugger() {
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
    initCollator(context.conf.i18n);
    return Promise.resolve(context);
}
