const buildOpts = require("minimist-options");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const proc = require("process");
const glossarify = require("./lib/glossarify");
const confSchema = require("./config.schema.json").properties;

// CLI
const cliOpts = buildOpts(
    Object.assign(
        {
            "config": { type: "string",  alias: "c", default: "./md-glossarify.conf.json" },
        },
        confSchema
    )
);
const args = minimist(proc.argv.slice(2), cliOpts);

// Read file opts
let conf = {};
const confPath = args.config || "./md-glossary.conf.json";
if (confPath) {
    try {
        conf = JSON.parse(fs.readFileSync(confPath));
    } catch (e) {
        console.error(`\nFailed to read config '${confPath}'.\n  ${e.message}.`);
        proc.exit(1);
    }
}

// Merge CLI opts with file opts
conf = Object.assign(args, conf);
conf.baseDir = path.resolve(proc.cwd(), (args._[0] || conf.baseDir));
if (!conf.unlink) {
    glossarify.link(conf);
} else {
    console.log("Removing links...not yet implemented.")
}

