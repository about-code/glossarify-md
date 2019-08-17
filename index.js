const buildOpts = require("minimist-options");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const proc = require("process");
const glossarify = require("./lib/glossarify");

// CLI
const cliOpts = buildOpts({
    "baseUrl":      { type: "string",  alias: "b", default: "http://localhost/glossary" },
    "config":       { type: "string",  alias: "c", default: "./md-glossarify.conf.json" },
    "glossaryFile": { type: "string",  alias: "g", default: "./glossary.md" },
    "linking":      { type: "string",  alias: "l", default: "relative" },
    "outDir":       { type: "string",  alias: "o", default: "./dist" },
    "unlink":       { type: "boolean", alias: "u", default: false }
});
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
    console.log("Linking...")
    glossarify.link(conf);
} else {
    console.log("Removing links...")
}

