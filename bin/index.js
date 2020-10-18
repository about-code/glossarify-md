#!/usr/bin/env node
const minimist = require("minimist");
const merge = require("deepmerge");
const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const program = require("../lib/main");
const confSchema = require("../conf.schema.json").properties;
const {NO_BASEDIR, NO_OUTDIR, OUTDIR_IS_BASEDIR, OUTDIR_NOT_DELETED, OUTDIR_IS_BASEDIR_WITH_DROP} = require("../lib/cli/messages");
const {version} = require("../package.json");

const CWD = proc.cwd();
const banner =
`┌──────────────────────────┐
│   glossarify-md v${version}   │
└──────────────────────────┘
`;
console.log(banner);

// _/ CLI \_____________________________________________________________________
const cli = {
    "config": {
        alias: "c"
        ,description: "Path to config file, e.g. './glossarify-md.conf.json'."
        ,type: "string"
        ,default: "./glossarify-md.conf.json"
    }
    ,"shallow": {
        alias: ""
        ,description: "A JSON serialized config object (e.g. \"{'baseDir': './input'}\") to shallow-merge with the default configuration or some configuration file provided with --config. Shallow merging replaces nested property values. Use --deep to deep-merge."
        ,type: "string"
        ,default: ""
    }
    ,"deep": {
        alias: ""
        ,description: "Deeply merge the given JSON configuration string with the configuration file or default configuration. This will extend nested arrays and replace only those keys exactly matching with the given structure. Use --shallow to shallow-merge."
        ,type: "string"
        ,default: ""
    }
    ,"help": {
        alias: "h"
        ,description: "Show this help."
        ,type: "boolean"
        ,default: false
    }
};
const argv = minimist(proc.argv.slice(2), cli);

// --help (or no args at all)
if (argv.help || proc.argv.length === 2) {
    printOpts(cli);
    process.exit(0);
}

// --config
let confDir = "";
let confPath = argv.config || "";
let optsFile = {};
if (confPath) {
    try {
        confPath = path.resolve(CWD, confPath);
        confDir = path.dirname(confPath);
        optsFile = JSON.parse(fs.readFileSync(confPath));
    } catch (e) {
        console.error(`Failed to read config '${confPath}'.\nReason:\n  ${e.message}\n`);
        proc.exit(1);
    }
} else {
    confDir = CWD;
}

const optsDefault = Object
    .keys(confSchema)
    .reduce((obj, key) => {
        obj[key] = confSchema[key].default;
        return obj;
    }, {});

let opts = Object.assign(optsDefault, optsFile);

// --deep
if (argv.deep) {
    try {
        opts = merge(opts, JSON.parse(argv.deep.replace(/'/g, "\"")));
    } catch (e) {
        console.error(`Failed to parse value for --deep.\nReason:\n  ${e.message}\n`);
        proc.exit(1);
    }
}
// --shallow
if (argv.shallow) {
    try {
        opts = Object.assign(opts, JSON.parse(argv.shallow.replace(/'/g, "\"")));
    } catch (e) {
        console.error(`Failed to parse value for --shallow.\nReason:\n  ${e.message}\n`);
        proc.exit(1);
    }
}
// Resolve 2nd arg paths relative to 1st arg paths...
opts.baseDir = path.resolve(confDir, opts.baseDir);
opts.outDir  = path.resolve(opts.baseDir, opts.outDir);
validateOpts(opts);

// _/ Drop old stuff \__________________________________________________________
if (opts.outDirDropOld) {
    try {
        fs.removeSync(opts.outDir);
    } catch (err) {
        console.log(OUTDIR_NOT_DELETED,` Reason: ${err.code}
    `);
    }
}


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

    if (conf.outDir === conf.baseDir) {
        if (conf.outDirDropOld) {
            console.log(OUTDIR_IS_BASEDIR_WITH_DROP);
            console.log("ABORTED.\n");
            proc.exit(0);
        } else if (!argv.force) {
            console.log(OUTDIR_IS_BASEDIR);
            console.log("ABORTED.\n");
            proc.exit(0);
        }
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
}
