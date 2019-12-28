#!/usr/bin/env node
const buildOpts = require("minimist-options");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const proc = require("process");
const program = require("../lib/main");
const confSchema = require("../conf.schema.json").properties;
const {NO_BASEDIR, NO_OUTDIR, OUTDIR_IS_BASEDIR} = require("../lib/cli/messages");
const {version} = require("../package.json");

const CWD = proc.cwd();
const banner =
`┌──────────────────────────┐
│   glossarify-md v${version}   │
└──────────────────────────┘
`;
console.log(banner);

// _/ CLI \_____________________________________________________________________
const optsSchema = Object.assign({
    "config": {
        alias: "c"
        ,description: "Path to config file, e.g. './glossarify-md.conf.json'."
    }
    ,type: "string"
    ,default: ""
    ,"help": {
        alias: "h"
        ,description: "Show this help."
        ,type: "boolean"
        ,default: false
    }
}, confSchema);
const optsDefault = minimist([], buildOpts(optsSchema));
const optsCli  = minimist(proc.argv.slice(2));
let optsFile = {};

// --help (or no args at all)
if (optsCli.help || proc.argv.length === 2) {
    printOpts(optsSchema);
}

// --config
let confDir = "";
let confPath = optsCli.config;
if (confPath) {
    try {
        confPath = path.resolve(CWD, confPath);
        optsFile = JSON.parse(fs.readFileSync(confPath));
        confDir = path.dirname(confPath);
    } catch (e) {
        console.error(`Failed to read config '${confPath}'.\nReason:\n  ${e.message}\n`);
        proc.exit(1);
    }
} else {
    confDir = CWD;
}


// Opts precedence: CLI over file over defaults
const opts = Object.assign(optsDefault, optsFile, optsCli);
// Resolve 2nd arg paths relative to 1st arg paths...
opts.baseDir = path.resolve(confDir, opts.baseDir);
opts.outDir  = path.resolve(opts.baseDir, opts.outDir);
validateOpts(opts);

// _/ Run \_____________________________________________________________________
program.run(opts);

// _/ Helpers \_________________________________________________________________
function validateOpts(conf) {

    if (conf.baseDir === "") {
        console.log(NO_BASEDIR);
        console.log("ABORTED.\n");
        proc.exit(0);
    }

    if (conf.outDir === "") {
        console.log(NO_OUTDIR);
        console.log("ABORTED.\n");
        proc.exit(0);
    }

    console.log(`☛ Reading from: ${conf.baseDir}`);
    console.log(`☛ Writing to:   ${conf.outDir}\n`);

    if (conf.outDir === conf.baseDir && !conf.force) {
        console.log(OUTDIR_IS_BASEDIR);
        console.log("ABORTED.\n");
        proc.exit(0);
    }
}

function printOpts(parameters) {
    console.log("Options:\n");
    console.log(
        Object
            .keys(parameters)
            .filter(key => key !== "dev")
            .sort((a, b) => a.localeCompare(b, "en"))
            .map(key => {
                const {alias, type, description, default:_default} = parameters[key];
                return `--${key}${alias ? ", --" + alias : ""} (${type})\n  ${description}\n  Default: ${JSON.stringify(_default)}\n\n`;
            })
            .join("")
    );
    process.exit(0);
}
