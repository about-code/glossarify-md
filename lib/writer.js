const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const glob = require("glob");
const unified = require("unified");
const remark_slug = require("remark-slug");
const remark_stringify = require("remark-stringify");
const remark_ref_links = require("remark-reference-links");
const {noopCompiler, printAst} = require("./ast-tools");
const {toSystemSlash, toForwardSlash, toRedactedPath} = require("./pathplus");

const indexer = require('./indexer');
const api = {};

api.copyBaseDirToOutDir = function(context) {
    const {baseDir, outDir, excludeFiles} = context.opts;
    if (baseDir === outDir) {
        return Promise.resolve(context);
    }
    const globOpts = {
        cwd: baseDir,
        ignore: excludeFiles,
        nodir: true,
        dot: true,
        absolute: true,
        matchBase: true,
        cache: {},
    }

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
                .then(() => resolve(context))
                .catch(reject)
        });
    });
}


api.writeOutput = function(context) {
    const {opts, vFiles} = context;
    const {outDir} = opts;
    return Promise.all(
        vFiles.map((vFile) => new Promise((resolve, reject) => {
            const p = path.resolve(outDir, vFile.path);
            fs.outputFile(p, vFile.toString(), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(context);
                }
            })
        }))
    ).then(() => context);
}

api.writeIndex = function(context) {
    const {generateFiles} = context.opts;
    const {indexFile} = generateFiles;
    if (! indexFile) {
        return Promise.resolve(context);;
    } else if (typeof indexFile === "object") {
        return this.writeMarkdownFile(context, indexer.getAST(context), indexFile.file);
    } else {
        return this.writeMarkdownFile(context, indexer.getAST(context), indexFile);
    }
}

api.writeMarkdownFile = function writeMarkdownFile(context, mdAst, filename) {
    const {outDir} = context.opts;
    return new Promise((resolve, reject) => {
        let processor = unified()
            .use(remark_slug)
            .use(remark_ref_links)
            .use(noopCompiler)
            .use(remark_stringify);

        processor.run(mdAst, (err, tree) => {
            if (err)  reject(err);
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
    const {terms: dict} = context;
    let report = "";
    dict.inOrder()
        .filter((term) => term.countOccurrenceTotal === 0)
        .forEach((term) => {
            report += `☛ ${term.glossary.file}: "${term.term}" has not been mentioned or has been mentioned only by unknown aliases.
`;
        });
    console.info(`\n${report}`);
    return Promise.resolve(context);
}

function redactPaths(context) {
    const {glossaries} = context;
    Object.values(glossaries).forEach(gloss => {
        gloss.basePath = toForwardSlash(toRedactedPath(gloss.basePath));
        gloss.outPath  = toForwardSlash(toRedactedPath(gloss.outPath ));
    });
}

/**
 * Writes some additional files in test mode.
 * @param {} context
 */
api.writeTestOutput = function (context) {
    const {terms, opts} = context;
    const {baseDir, dev} = opts;
    const {termsFile, reproducablePaths} = dev;
    if (! termsFile)
        return;

    const termsFile_ = toSystemSlash(path.resolve(baseDir, termsFile));
    return new Promise((resolve, reject) => {
        if (reproducablePaths) {
            redactPaths(context);                       /* [1] */
        }
        const output = JSON
            .stringify(terms.inOrder(), null, 2)        /* [2] */
            .replace('\r', '')                          /* [3] */
            + '\n';                                     /* [4] */

        fs.outputFile(termsFile_, output, (err) => {
            err ? reject(err) : resolve(context);
        });
    });

    // [1]: Redact paths written to test output files to avoid system-dependent
    // paths breaking tests in CI environment. Redacts anything from system root
    // upd to CWD.
    // [2]: Important! Write terms in defined order to get reliable diff.
    // [3]: Important! Drop carriage-return in CRLF (\r\n) windows-style
    // line-endings to get LF (\n) unix-style line endings for reliable
    // cross-plattform git-diffs. Also make sure a .gitattributes file
    // exists in the repo with:
    //
    //   * text eol=auto
    //   /test/* text eol=lf'
    //
    // [4]: Add newline at EOF.
}

module.exports = api;
