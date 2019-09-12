const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const glob = require("glob");
const {toForwardSlash, toSystemSlash} = require("./pathplus");

const CWD = proc.cwd();
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
        glob(baseDir + "/**/*", globOpts, (err, files) => {
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
            })})
        )
    ).then(() => context);
}

/**
 * Writes some additional files in test mode.
 * @param {} context
 */
api.writeTestOutput = function (context) {
    const {terms, opts} = context;
    const {baseDir, dev} = opts;
    const {termsFile} = dev;
    if (! termsFile)
        return;

    const termsFile_ = toSystemSlash(path.resolve(baseDir, termsFile));
    Object.values(context.glossaries).forEach(gloss => {
        gloss.basePath = `/{redacted}/${toForwardSlash(path.relative(CWD, gloss.basePath))}`;
        gloss.outPath  = `/{redacted}/${toForwardSlash(path.relative(CWD, gloss.outPath ))}`;
    });
    return new Promise((resolve, reject) => {
        fs.outputFile(termsFile_, JSON.stringify(terms.byOccurrence(), null, 2)+ "\n", (err) => {
            err ? reject(err) : resolve(context);
        });
    });
}

module.exports = api;
