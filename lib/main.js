import GitHubSlugger from "github-slugger";
import { exportGlossaries } from "./exporter.js";
import { importGlossaries } from "./importer.js";
import { newContext } from "./model/context.js";
import { getRunnableConfig } from "./model/config.js";
import { readDocumentFiles, readGlossaries } from "./reader.js";
import {
    copyBaseDirToOutDir,
    writeDocumentFiles,
    writeIndexFiles,
    writeListFiles,
    writeReport,
    writeTestOutput
} from "./writer.js";

/**
 * @param {object} conf Configuration adhering to the external configuration schema.
 * Assumed to have been initialized with default values for options not provided by
 * users themselves.
 * @param {object} forceFlag A flag indicating presence of the --force CLI argument.
 * @returns {Promise} a promise from an async execution resolving to an object representing the execution context.
 */
async function run(conf) {
    const context = await newContext(conf);
    await copyBaseDirToOutDir(context);
    await importGlossaries(context);
    await readGlossaries(context);
    await readDocumentFiles(context);
    await exportGlossaries(context);
    await Promise.all([
        writeDocumentFiles(context)
        ,writeIndexFiles(context)
        ,writeListFiles(context)
    ]);
    await Promise.all([
        writeReport(context)
        ,writeTestOutput(context)
    ]);
    return context;
}

/**
 * @param {object} confUser User-provided configuration adhering to the external configuration schema.
 * @returns {Promise} a promise from an async execution resolving to an object representing the execution context.
 */
export async function runViaApi(confUser) {
    const conf = getRunnableConfig(confUser);
    return run(conf);
}

/**
 * Call when running from CLI and when configuration schema defaults have already
 * been applied on a user-provided configuration. To be used internally. Not meant to be
 * exported as part of the programming API.
 *
 * @see config.js#getRunnableConfig
 * @see #runViaApi
 */
export const runViaCli = run;

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
