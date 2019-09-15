#!/usr/bin/env node
const buildOpts = require("minimist-options");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const proc = require("process");
const glossarify = require("../lib/glossarify");
const confSchema = require("../conf.schema.json").properties;

const CWD = proc.cwd();
const {version} = require("../package.json");

console.log(
`┌──────────────────────────┐
│   glossarify-md v${version}   │
└──────────────────────────┘
`)

// CLI
const cliOpts = buildOpts(
    Object.assign(
        {
            "config": { type: "string",  alias: "c", default: "" },
            "help":   { type: "boolean", alias: "h", default: false}
        },
        confSchema
    )
);
const args = minimist(proc.argv.slice(2), cliOpts);

if (args.help) {
    console.log("Options:\n\n",
        Object
            .keys(confSchema)
            .filter(key => key !== "dev")
            .map(key => {
                const {alias, type, description, default:_default} = confSchema[key];
                return `--${alias} --${key} (${type})\n${description}\nDefault: ${JSON.stringify(_default)}\n\n`;
            })
            .join("")
    );
    process.exit(0);
}

// Read file opts
let conf = {};
const confPath = args.config;
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

// Merge CLI opts with file opts
conf = Object.assign(args, conf);
conf.baseDir = path.resolve(confDir, conf.baseDir);
conf.outDir  = path.resolve(conf.baseDir, conf.outDir);
console.log(`-> Reading from: ${conf.baseDir}`);
console.log(`-> Writing to:   ${conf.outDir}
`);

glossarify.glossarify(conf);

