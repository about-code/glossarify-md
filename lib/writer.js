import fs from "fs-extra";
import path from "node:path";
import proc from "node:process";
import remark_link_headings from "remark-autolink-headings";
import remark_gfm from "remark-gfm";
import remark_ref_links from "remark-reference-links";
import remark_stringify from "remark-stringify";
import { Glob } from "glob";
import { unified } from "unified";
import { VFile } from "vfile";
import { withNodeType } from "./ast/with/node-type.js";
import { TermDefinitionNode } from "./ast/with/term-definition-node.js";
import { OUTDIR_NOT_DELETED } from "./cli/messages.js";
import { withIdentifier } from "./identifier.js";
import { getAST as getListOfAnchorsAST } from "./index/anchors.js";
import { getAST as getIndexOfTermsAST, IDX_TERMS } from "./index/terms.js";
import { getIndex } from "./indexer.js";
import { PandocHeadingIdNode } from "./pandoc/pandoc-heading-id-node.js";
import { pandoc_heading_append_id } from "./pandoc/pandoc-heading-id-plugin.js";
import { withReproducablePaths } from "./path/plugins.js";
import { toReproducablePath, toForwardSlash, toSystemSlash } from "./path/tools.js";
import { whenTrue } from "./plugin/tools.js";
import { getHash8 } from "./text/tools.js";

const CWD = proc.cwd();
const IS_MD_FILE = /\.(md|mkd|mkdn|mdwn|mdown|markdown)$/;
const modified = {};

/**
 * @typedef {import("./model/context")} Context
 */

export async function writeTextFile(context, vFile) {
    const p = path.resolve(context.conf.outDir, vFile.path);
    await new Promise((resolve, reject) => {
        fs.outputFile(p, vFile.value, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
    return context;
}

/**
 * @param {Context} context
 * @returns {Promise<Context>} context
 */
export async function copyBaseDirToOutDir(context) {
    const {baseDir, outDir, outDirDropOld, excludeFiles} = context.conf;
    if (baseDir === outDir) {
        return context;
    }
    if (outDirDropOld) {
        try {
            await fs.remove(outDir);
        } catch (err) {
            console.log(OUTDIR_NOT_DELETED,` Reason: ${err.code}\n`);
        }
    }
    const globOpts = {
        cwd: baseDir
        ,ignore: excludeFiles
        ,nodir: true
        ,dot: true
        ,absolute: true
        ,matchBase: true
        ,cache: {}
    };
    const g = new Glob("**/*", globOpts);
    for await (const filename of g) {
        const from = toSystemSlash(filename);
        const from_ = getHash8(from);
        const to = toSystemSlash(
            toForwardSlash(filename).replace(baseDir, outDir)
        );
        const stat = await fs.stat(from);
        const mTimeMs = stat.mtimeMs;
        if (! modified[from_]
            || modified[from_] < mTimeMs
            || IS_MD_FILE.test(filename) // [1]
        ) {
            await fs.copy(from, to);
            modified[from_] = mTimeMs;
        }
    }

    // make outDir the new baseDir
    context.setBaseDir(outDir);
    return context;

    // ___/ Implementation Notes \___
    // [1] In --watch mode it can be more efficient to copy only files from
    // 'baseDir' that have changed. Ideally, we could apply this to markdown
    // files, too. However, it's required to carry out linkification on the
    // complete *raw* input fileset. Term occurrences in a linkified fileset
    // can't be distinguished from words that have been linkified *manually*
    // by an author. Because the latter have to be left untouched, it makes a
    // difference whether to run linkification on a raw fileset or running
    // it on a previously linkified fileset. Side effects that could happen when
    // running on a linkified fileset is that actual term occurrences wouldn't
    // get modified anymore when they had to. For example, when some author adds
    // *alternative definitions* of a term. Those require any term occurrence to
    // be identified *and modified* with additional links to be added for the
    // alternative definitions of the term.
}

export async function writeDocumentFiles(context) {
    const promises = context.writeFiles.map(async (vFile) => writeTextFile(context, vFile));
    await Promise.all(promises);
    return context;
}

export async function writeIndexFiles(context) {
    const promises = [];
    const {generateFiles} = context.conf;
    let {indexFile, indexFiles} = generateFiles;
    if (! indexFiles || !Object.prototype.toString.call(indexFile) === "[object Array]") {
        indexFiles = [];
    }
    if (indexFile && Object.prototype.toString.call(indexFile) === "[object Object]") {
        indexFiles.push(indexFile);
    }
    for (let i = 0, len = indexFiles.length; i < len; i++) {
        const indexFilesConf = indexFiles[i];
        promises.push(writeMarkdownFile(context, new VFile({
            path: indexFilesConf.file
            ,tree: getIndexOfTermsAST(context, indexFilesConf)
        })));
    }
    await Promise.all(promises);
    return context;
}

export async function writeListFiles(context) {
    const {listOf} = context.conf.generateFiles;
    if (Array.isArray(listOf)) {
        const promises = listOf
            .filter(listOfConf => !!listOfConf.file)
            .map(async (listOfConf) => {
                const mdAst = getListOfAnchorsAST(context, listOfConf);
                await writeMarkdownFile(context, new VFile({
                    path: listOfConf.file
                    ,tree: mdAst
                }));
            });
        await Promise.all(promises);
        return context;
    } else {
        return context;
    }
}

export async function writeMarkdownFile(context, vFile) {
    const {linking, dev, unified: unifiedConf} = context.conf;
    return new Promise((resolve, reject) => {
        const processor = unified()
            .use(withNodeType(PandocHeadingIdNode))
            .use(remark_stringify) // compiler
            .use(withIdentifier(context))
            .use(remark_gfm)
            .use(whenTrue(linking.byReferenceDefinition, remark_ref_links))
            .use(whenTrue(linking.headingAsLink, remark_link_headings), {behavior: "wrap"})
            .use(whenTrue(linking.headingIdPandoc, pandoc_heading_append_id))
            .use(whenTrue(dev.reproducablePaths, withReproducablePaths(context)));
        processor.data(unifiedConf);
        processor.run(vFile.tree, (err, tree) => {
            if (err)  {
                reject(err);
                return;
            }
            vFile.value = processor.stringify(tree);
            writeTextFile(context, vFile).then(resolve, reject);
        });
    });
}

export async function writeReport(context) {
    const {conf} = context;
    const {reportNotMentioned} = conf;
    const termsIndexed = getIndex(IDX_TERMS)[0];

    if (reportNotMentioned && termsIndexed) {
        const termNodes = termsIndexed.map(indexEntry => indexEntry.node);
        let report = "";
        termNodes
            .sort(TermDefinitionNode.compare)
            .filter((term) => term.countOccurrenceTotal === 0)
            .forEach((term) => {
                report += `☛ ${term.glossVFile.glossConf.file}: "${term.value}" has not been mentioned or has been mentioned only by unknown aliases.
`;
            });
        context.report = report;
        console.info(`\n${report}`);
    }
    return Promise.resolve(context);
}

/**
 * Writes some additional files in test mode.
 * @param {} context
 */
export async function writeTestOutput(context) {
    const {report, conf} = context;
    const {termsFile, reportsFile, effectiveConfFile} = conf.dev;
    const indexedTerms = getIndex(IDX_TERMS)[0];
    const promises = [];
    if (effectiveConfFile) {
        const snapshot = Object.assign({}, conf);
        snapshot.baseDir = toReproducablePath(CWD, conf.baseDir, "{CWD}");
        snapshot.outDir  = toReproducablePath(CWD, conf.outDir, "{CWD}");
        promises.push(writeTestFile(context, effectiveConfFile, JSON.stringify(snapshot, null, 2)));
    }
    if (termsFile && indexedTerms) {
        // Important! Write terms in defined order to get reliable diff.
        const terms = indexedTerms
            .map(indexEntry => indexEntry.node)
            .sort(TermDefinitionNode.compare);
        promises.push(writeTestFile(context, termsFile, JSON.stringify(terms, null, 2)));
    }
    if (reportsFile) {
        promises.push(writeTestFile(context, reportsFile, report || ""));
    }
    await Promise.all(promises);
    return context;
}

export async function writeTestFile(context, filename, strData) {
    const vFile = new VFile({
        path: filename
        ,value: `${strData}`
            .replace("\r", "")               /* [1] */
            + "\n"                           /* [2] */
    });
    return writeTextFile(context, vFile);
    // [1]: Important! Drop carriage-return in CRLF (\r\n) windows-style
    // line-endings to get LF (\n) unix-style line endings for reliable
    // cross-plattform git-diffs. Also make sure a .gitattributes file
    // exists in the repo with:
    //
    //   * text eol=auto
    //   /test/* text eol=lf'
    //
    // [2]: Add newline at EOF.
}
