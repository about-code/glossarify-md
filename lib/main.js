import GitHubSlugger from "github-slugger";
import { exportGlossaries } from "./exporter.js";
import { importGlossaries } from "./importer.js";
import { newContext } from "./model/context.js";
import { validateConfig, getRunnableConfig } from "./model/config.js";
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
 * @param {object} confUser User-provided configuration adhering to the external configuration schema.
 * @returns {Promise} a promise from an async execution resolving to an object representing the execution context.
 */
export async function runViaApi(confUser) {
    const conf = getRunnableConfig(confUser);
    conf.force = false;
    return run(conf);
}


/**
 * @param {object} confUser User-provided configuration adhering to the external configuration schema. Assumed to
 * have been derived from applying config.js#getRunConfig() already.
 * @param {object} forceFlag A flag indicating presence of the --force CLI argument.
 * @returns {Promise} a promise from an async execution resolving to an object representing the execution context.
 */
export async function runViaCli(conf, forceFlag) {
    conf.force = forceFlag;
    return run(conf);
}

async function run(conf) {

    validateConfig(conf);

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
