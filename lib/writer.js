const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const glob = require("glob");
const unified = require("unified");
const remark_slug = require("remark-slug");
const remark_ref_links = require("remark-reference-links");
const remark_autolink_headings = require("remark-autolink-headings");
const remark_stringify = require("remark-stringify");

const {noopCompiler} = require("./ast/tools");
const {toSystemSlash} = require("./path/tools");
const {getAST: getIndexerAST} = require("./index/terms");
const {getAST: getListOfFiguresAST} = require("./index/figures");
const {getAST: getListOfTablesAST} = require("./index/tables");
const {getAST: getListOfAnyAST} = require("./index/any");
/**
 * @typedef {import("./model/context")} Context
 */

const api = {};

/**
 * @param {Context} context
 * @returns {Promise<Context>} context
 */
api.copyBaseDirToOutDir = function(context) {
    const {baseDir, outDir, excludeFiles} = context.opts;
    if (baseDir === outDir) {
        return Promise.resolve(context);
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
                    context.baseDir = outDir;
                    context.opts.baseDir = outDir;
                    resolve(context);
                })
                .catch(reject);
        });
    });
};


api.writeOutput = function(context) {
    const {opts, vFiles} = context;
    const {outDir} = opts;
    const promises = vFiles.map((vFile) => new Promise((resolve, reject) => {
        const p = path.resolve(outDir, vFile.path);
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
    const {generateFiles} = context.opts;
    const {indexFile} = generateFiles;

    if (! indexFile || typeof indexFile !== "object") {
        return Promise.resolve(context);
    } else {
        return this.writeMarkdownFile(context, getIndexerAST(context), indexFile.file);
    }
};

api.writeListOfFigures = function(context) {
    const {generateFiles} = context.opts;
    const {listOfFigures} = generateFiles;
    if (! listOfFigures) {
        return Promise.resolve(context);
    } else if (typeof listOfFigures === "object") {
        return this.writeMarkdownFile(context, getListOfFiguresAST(context), listOfFigures.file);
    }
};

api.writeListOfTables = function(context) {
    const {generateFiles} = context.opts;
    const {listOfTables} = generateFiles;
    if (! listOfTables) {
        return Promise.resolve(context);
    } else if (typeof listOfTables === "object") {
        return this.writeMarkdownFile(context, getListOfTablesAST(context), listOfTables.file);
    }
};

api.writeListsOfAny = function(context) {
    const {listOf} = context.opts.generateFiles;
    if (Array.isArray(listOf)) {
        return Promise
            .all(listOf.map((opts) => {
                const mdAst = getListOfAnyAST(context, opts);
                return this.writeMarkdownFile(context, mdAst, opts.file);
            }))
            .then(() => context);
    } else {
        return Promise.resolve(context);
    }
};

api.writeMarkdownFile = function writeMarkdownFile(context, mdAst, filename) {
    const {outDir} = context.opts;
    return new Promise((resolve, reject) => {
        let processor = unified()
            .use(noopCompiler)
            .use(remark_slug)
            .use(remark_ref_links)
            .use(remark_autolink_headings, {behavior: "wrap"})
            .use(remark_stringify)
            ;

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
    const {opts, terms: dict} = context;
    const {reportNotMentioned} = opts;
    if (reportNotMentioned) {
        let report = "";
        dict.inOrder()
            .filter((term) => term.countOccurrenceTotal === 0)
            .forEach((term) => {
                report += `☛ ${term.glossary.file}: "${term.term}" has not been mentioned or has been mentioned only by unknown aliases.
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
    const {terms, report, opts} = context;
    const {termsFile, reportsFile} = opts.dev;
    const promises = [];
    if (termsFile) {
        // Important! Write terms in defined order to get reliable diff.
        promises.push(writeTextFile(context, termsFile, JSON.stringify(terms.inOrder(), null, 2)));
    }
    if (reportsFile) {
        promises.push(writeTextFile(context, reportsFile, report || ""));
    }
    return Promise
        .all(promises)
        .then(() => context);
};

function writeTextFile(context, filename, data) {
    const {baseDir} = context.opts;
    const filename_ = toSystemSlash(path.resolve(baseDir, filename));
    return new Promise((resolve, reject) => {
        const output = `${data}`
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

module.exports = api;
