#!/usr/bin/env node
const buildOpts = require("minimist-options");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const proc = require("process");
const glossarify = require("../lib/glossarify");
const confSchema = require("../conf.schema.json").properties;
const messages = require("../lib/messages");

const CWD = proc.cwd();
const {version} = require("../package.json");

console.log(
`┌──────────────────────────┐
│   glossarify-md v${version}   │
└──────────────────────────┘
`)

const opts = Object.assign(
    {
        "config": { type: "string",  alias: "c", default: ""   , description: "Path to config file, e.g. './glossarify-md.conf.json'."},
        "help":   { type: "boolean", alias: "h", default: false, description: "Show this help."}
    },
    confSchema
);

// CLI
const defaults = minimist([], buildOpts(opts));
const cliArgs  = minimist(proc.argv.slice(2));
let conf = {};

// --help (or no args at all)
if (cliArgs.help || proc.argv.length === 2) {
    printHelp(opts);
}
// --config
const confPath = cliArgs.config;
let confDir = CWD;
if (confPath) {
    try {
        conf = JSON.parse(fs.readFileSync(path.resolve(CWD, confPath)));
        confDir = path.dirname(confPath);
    } catch (e) {
        console.error(`Failed to read config '${confPath}'.\nReason:\n  ${e.message}\n`);
        proc.exit(1);
    }
}

// command-line arguments must take precedence over config file and defaults
conf = Object.assign(defaults, conf, cliArgs);
conf.baseDir = path.resolve(confDir, conf.baseDir);
conf.outDir  = path.resolve(conf.baseDir, conf.outDir);
validateConfig(conf);

// Run
glossarify.glossarify(conf);

// Helpers
function printHelp(parameters) {
    console.log("Options:\n");
    console.log(
        Object
            .keys(parameters)
            .filter(key => key !== "dev")
            .sort((a, b) => a.localeCompare(b, "en"))
            .map(key => {
                const {alias, type, description, default:_default} = parameters[key];
                return `--${key}${alias ? ', --' + alias : ''} (${type})\n  ${description}\n  Default: ${JSON.stringify(_default)}\n\n`;
            })
            .join("")
    );
    process.exit(0);
}

function validateConfig(conf) {

    if (conf.baseDir === "") {
        console.log(messages.NO_BASEDIR);
        console.log('ABORTED.\n');
        proc.exit(0);
    }

    if (conf.outDir === "") {
        console.log(messages.NO_OUTDIR);
        console.log('ABORTED.\n');
        proc.exit(0);
    }

    console.log(`☛ Reading from: ${conf.baseDir}`);
    console.log(`☛ Writing to:   ${conf.outDir}
    `);

    if (conf.outDir === conf.baseDir && !conf.force) {
        console.log(messages.OUTDIR_IS_BASEDIR)
        console.log('ABORTED.\n');
        proc.exit(0);
    }
}
