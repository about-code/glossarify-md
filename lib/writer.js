const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const glob = require("glob");
const unified = require("unified");
const remark_slug = require("remark-slug");
const remark_ref_links = require("remark-reference-links");
const remark_autolink_headings = require("remark-autolink-headings");
const remark_footnotes = require("remark-footnotes");
const remark_stringify = require("remark-stringify");
const {TermDefinitionNode} = require("./ast/with/term-definition");
const {toSystemSlash, toReproducablePath} = require("./path/tools");
const {OUTDIR_NOT_DELETED} = require("./cli/messages");
const {getIndex} = require("./indexer");
const {getAST: getIndexOfTermsAST, IDX_TERMS} = require("./index/terms");
const {getAST: getListOfAnchorsAST} = require("./index/anchors");
/**
 * @typedef {import("./model/context")} Context
 */

const api = {};

/**
 * @param {Context} context
 * @returns {Promise<Context>} context
 */
api.copyBaseDirToOutDir = function(context) {
    const {baseDir, outDir, outDirDropOld, excludeFiles} = context.conf;
    if (baseDir === outDir) {
        return Promise.resolve(context);
    }
    if (outDirDropOld) {
        try {
            fs.removeSync(outDir);
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
    return new Promise((resolve, reject) => {
        glob("**/*", globOpts, (err, files) => {
            const promises = [];
            if (err) {
                console.error(err);
                promises.push(Promise.reject(err));
                proc.exit(1);
            }
            for (let i = 0, len = files.length; i < len; i++) {
                const filename = files[i];
                promises.push(
                    fs.copy(
                        toSystemSlash(filename),
                        toSystemSlash(filename.replace(baseDir, outDir))
                    )
                );
            }
            Promise
                .all(promises)
                .then(() => {
                    // make outDir the new baseDir
                    context.setBaseDir(outDir);
                    resolve(context);
                })
                .catch(reject);
        });
    });
};


api.writeOutput = function(context) {
    const {vFiles} = context;
    const promises = vFiles.map((vFile) => new Promise((resolve, reject) => {
        const p = context.resolvePath(vFile.path);
        fs.outputFile(p, vFile.toString(), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(context);
            }

        });
    }));
    return Promise.all(promises).then(() => context);
};

api.writeIndex = function(context) {
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
        promises.push(this.writeMarkdownFile(context, getIndexOfTermsAST(context, indexFiles[i]), indexFiles[i].file));
    }
    return Promise
        .all(promises)
        .then(() => Promise.resolve(context));
};

api.writeListOfAnchors = function(context) {
    const {listOf} = context.conf.generateFiles;
    if (Array.isArray(listOf)) {
        return Promise
            .all(listOf
                .filter(listOfConf => !!listOfConf.file)
                .map((listOfConf) => {
                    const mdAst = getListOfAnchorsAST(context, listOfConf);
                    return this.writeMarkdownFile(context, mdAst, listOfConf.file);
                })
            )
            .then(() => context);
    } else {
        return Promise.resolve(context);
    }
};

api.writeMarkdownFile = function writeMarkdownFile(context, mdAst, filename) {
    const {outDir, unified: unifiedConf} = context.conf;
    return new Promise((resolve, reject) => {
        const processor = unified()
            .use(remark_stringify) // compiler
            .use(remark_slug)
            .use(remark_ref_links)
            .use(remark_autolink_headings, {behavior: "wrap"})
            .use(remark_footnotes, {inlineNotes: true});
        processor.data(unifiedConf);
        processor.run(mdAst, (err, tree) => {
            if (err)  {
                reject(err);
            }
            const p = path.resolve(outDir, filename);
            fs.outputFile(p, processor.stringify(tree), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(context);
                }
            });
        });
    });
};

api.writeReport = function(context) {
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
                report += `☛ ${term.glossary.file}: "${term.value}" has not been mentioned or has been mentioned only by unknown aliases.
`;
            });
        context.report = report;
        console.info(`\n${report}`);
    }
    return Promise.resolve(context);
};

/**
 * Writes some additional files in test mode.
 * @param {} context
 */
api.writeTestOutput = function (context) {
    const {report, conf} = context;
    const {termsFile, reportsFile, effectiveConfFile} = conf.dev;
    const indexedTerms = getIndex(IDX_TERMS)[0];
    const promises = [];
    if (effectiveConfFile) {
        const snapshot = Object.assign({}, conf);
        snapshot.baseDir = toReproducablePath(conf.baseDir, "{CWD}");
        snapshot.outDir = toReproducablePath(conf.outDir, "{CWD}");
        promises.push(writeTextFile(context, effectiveConfFile, JSON.stringify(snapshot, null, 2)));
    }
    if (termsFile && indexedTerms) {
        // Important! Write terms in defined order to get reliable diff.
        const terms = indexedTerms
            .map(indexEntry => indexEntry.node)
            .sort(TermDefinitionNode.compare);
        promises.push(writeTextFile(context, termsFile, JSON.stringify(terms, null, 2)));
    }
    if (reportsFile) {
        promises.push(writeTextFile(context, reportsFile, report || ""));
    }
    return Promise
        .all(promises)
        .then(() => context);
};

function writeTextFile(context, filename, strData) {
    const {baseDir} = context.conf;
    const filename_ = toSystemSlash(path.resolve(baseDir, filename));
    return new Promise((resolve, reject) => {
        const output = `${strData}`
            .replace("\r", "")               /* [1] */
            + "\n";                          /* [2] */

        fs.outputFile(filename_, output, (err) => {
            err ? reject(err) : resolve(context);
        });
    });
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
api.writeTextFile = writeTextFile;
module.exports = api;
