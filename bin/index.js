#!/usr/bin/env node
const buildOpts = require("minimist-options");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const proc = require("process");
const glossarify = require("../lib/glossarify");
const confSchema = require("../conf.schema.json").properties;

const CWD = proc.cwd();

// CLI
const cliOpts = buildOpts(
    Object.assign(
        {
            "config": { type: "string",  alias: "c", default: "" },
        },
        confSchema
    )
);
const args = minimist(proc.argv.slice(2), cliOpts);

// Read file opts
let conf = {};
if (args.config) {
    const confPath = args.config;
    try {
        conf = JSON.parse(fs.readFileSync(path.resolve(CWD, confPath)));
    } catch (e) {
        console.error(`\nFailed to read config '${confPath}'.\n  ${e.message}.`);
        proc.exit(1);
    }
}

// Merge CLI opts with file opts
conf = Object.assign(args, conf);
conf.baseDir = path.resolve(CWD, (args._[0] || conf.baseDir));
glossarify.link(conf);

