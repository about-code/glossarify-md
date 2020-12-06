#!/usr/bin/env node
const minimist = require("minimist");
const merge = require("deepmerge");
const fs = require("fs-extra");
const path = require("path");
const proc = require("process");
const program = require("../lib/main");
const upgrade = require("../lib/cli/upgrade");
const confSchema = require("../conf/v5/schema.json").properties;
const {NO_BASEDIR, NO_OUTDIR, OUTDIR_IS_BASEDIR, OUTDIR_IS_BASEDIR_WITH_DROP} = require("../lib/cli/messages");
const {version} = require("../package.json");
const CWD = proc.cwd();
const banner =
`┌──────────────────────────┐
│   glossarify-md v${version}   │
└──────────────────────────┘
`;

// _/ CLI \_____________________________________________________________________
const cli = {
    "init": {
        alias: "new"
        ,description: "Generate a complete configuration file with default values."
        ,type: "boolean"
        ,default: false
    }
    ,"config": {
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

if (!argv.init) {
    // print banner only without --init to prevent writing banner to config.
    console.log(banner);
}
// --help (or no args at all)
if (argv.help || proc.argv.length === 2) {
    printOpts(cli);
    proc.exit(0);
}

// --config
let confDir = "";
let confPath = argv.config || "";
let confData = {};
let optsPromise = Promise.resolve({});
if (confPath) {
    try {
        confPath = path.resolve(CWD, confPath);
        confDir = path.dirname(confPath);
        confData = JSON.parse(fs.readFileSync(confPath));
        if (!argv.noupgrade) {
            optsPromise = upgrade(confData, confPath);
        }
    } catch (e) {
        console.error(`Failed to read config '${confPath}'.\nReason:\n  ${e.message}\n`);
        proc.exit(1);
    }
} else {
    confDir = CWD;
}

optsPromise.then((opts) => {

    // --deep custum opts
    if (argv.deep) {
        try {
            opts = merge(opts, JSON.parse(argv.deep.replace(/'/g, "\"")));
        } catch (e) {
            console.error(`Failed to parse value for --deep.\nReason:\n  ${e.message}\n`);
            proc.exit(1);
        }
    }
    // --shallow custom opts
    if (argv.shallow) {
        try {
            opts = Object.assign(opts, JSON.parse(argv.shallow.replace(/'/g, "\"")));
        } catch (e) {
            console.error(`Failed to parse value for --shallow.\nReason:\n  ${e.message}\n`);
            proc.exit(1);
        }
    }
    // Merge custom opts with default opts
    const optsDefault = Object.keys(confSchema).reduce((obj, key) => {
        obj[key] = confSchema[key].default;
        return obj;
    }, {});
    opts = merge(optsDefault, opts, {
        clone: false
        , arrayMerge: (_default, curOpts) => {
            return curOpts && curOpts.length > 0 ? curOpts : _default;
        }
    });

    // --init
    if (argv.init) {
        console.log(JSON.stringify(opts, null, 2));
        proc.exit(0);
    }

    // Resolve baseDir relative to confDir and outDir relative to baseDir
    opts.baseDir = path.resolve(confDir, opts.baseDir);
    opts.outDir  = path.resolve(opts.baseDir, opts.outDir);
    validateOpts(opts);

    // _/ Run \_____________________________________________________________________
    program.run(opts);
}).catch(error => {
    console.error(error);
    proc.exit(1);
});

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
