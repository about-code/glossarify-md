const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const glob = require("glob");
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
        absolute: true,
        matchBase: true,
        cache: {},
    }
    const promises = [];
    glob(baseDir + "/**/*", globOpts, (err, files) => {
        if (err) {
            console.error(err);
            promises.push(Promise.reject(err));
            proc.exit(1);
        }
        for (let i = 0, len = files.length; i < len; i++) {
            const filename = files[i];
            promises.push(fs.copy(filename, filename.replace(baseDir, outDir)));
        }
    });
    return Promise
        .all(promises)
        .then(() => context)
        .catch(err => { throw err; });
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

    const termsFile_ = path.resolve(baseDir, termsFile);
    Object.values(context.glossaries).forEach(gloss => {
        gloss.basePath = `/{redacted}/${path.relative(CWD, gloss.basePath)}`;
        gloss.outPath  = `/{redacted}/${path.relative(CWD, gloss.outPath )}`;
    });
    return new Promise((resolve, reject) => {
        fs.outputFile(termsFile_, JSON.stringify(terms.byOccurrence(), null, 2)+ "\n", (err) => {
            err ? reject(err) : resolve(context);
        });
    });
}

module.exports = api;
