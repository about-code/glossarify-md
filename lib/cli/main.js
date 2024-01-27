import merge from "deepmerge";
import fs from "fs-extra";
import minimist from "minimist";
import nodeFs from "node:fs";
import path from "node:path";
import proc from "node:process";

import { createRequire } from "node:module";
import { upgrade } from "./upgrade.js";
import { runViaCli } from "../main.js";
import { getRunnableConfig, getDefaultConfig } from "../model/config.js";
import { watch } from "chokidar";
import { ConfigError } from "../model/errors.js";

const require_ = createRequire(import.meta.url);
const packageJson = require_("../../package.json");
const version = packageJson.version;
const CWD = proc.cwd();
const banner =
`┌──────────────────────────┐
│   glossarify-md v${version}   │
└──────────────────────────┘
`;

// _/ CLI \_____________________________________________________________________
const cli = {
    "config": {
        alias: "c"
        ,description: "Path to config file, e.g. './glossarify-md.conf.json'."
        ,type: "string"
        ,default: "./glossarify-md.conf.json"
    }
    ,"deep": {
        alias: ""
        ,description: "Deeply merge the given JSON configuration string with the configuration file or default configuration. This will _extend_ nested arrays and replace only those keys exactly matching with the given structure. Use --shallow to shallow-merge."
        ,type: "string"
        ,default: ""
    }
    ,"help": {
        alias: "h"
        ,description: "Show this help."
        ,type: "boolean"
        ,default: false
    }
    ,"init": {
        alias: ""
        ,description: "Generate a configuration file with default values. Usage: 'glossarify-md --init > glossarify-md.conf.json'"
        ,type: "boolean"
        ,default: false
    }
    ,"local": {
        alias: ""
        ,description: "When used with --init generates a configuration using a local node_modules path to the config schema."
        ,type: "boolean"
        ,default: false
    }
    ,"logfile": {
        alias: ""
        ,description: "Where to write console logs into. Used for testing."
        ,type: "string"
        ,default: ""
    }
    ,"more": {
        alias: ""
        ,description: "When used with --init generates an extended configuration with default values otherwise applied in the background."
        ,type: "boolean"
        ,default: false
    }
    ,"new": {
        alias: ""
        ,description: "When used with --init generates a file ./docs/glossary.md"
        ,type: "boolean"
        ,default: false
    }
    ,"noupgrade": {
        alias: ""
        ,description: "When used prevents entering an interactive upgrade workflow when upgrade routines are available."
        ,type: "boolean"
        ,default: false
    }
    ,"shallow": {
        alias: ""
        ,description: "A JSON string for an object to be shallow-merged with the default configuration or a configuration file provided with --config. Usage: `glossarify-md --shallow \"{'baseDir': './input'}\"`. Shallow merging _replaces_ nested property values. Use --deep to deep-merge."
        ,type: "string"
        ,default: ""
    }
    ,"watch": {
        alias: "w"
        ,description: "Watch the base directory"
        ,type: "boolean"
        ,default: false
    }
};

export async function main(args) {
    const argv = minimist(args, cli);

    // --logfile
    if (argv.logfile) {
        try {
            nodeFs.unlinkSync(argv.logfile);
        } catch (err) {
            /* ignore */
        }
        nodeFs.mkdirSync(path.dirname(argv.logfile), { recursive: true });
        const logfile = path.resolve(argv.logfile);
        const logError = console.error;
        const logger = (txt) => {
            try {
                nodeFs.writeFileSync(logfile, `${txt}\n`, { flag: "a"});
            } catch (err) {
                logError(err);
            }
        };
        console.log = logger;
        console.warn = logger;
        console.error = logger;
        console.info = logger;
    }

    // --init
    // Show banner only in absence of --init; Prevents writing banner
    // to file for 'glossarify-md --init >> glossarify-md.conf.json'
    if (!argv.init) {
        console.log(banner);
    }

    // --help (or no args at all)
    if (argv.help || args.length === 0) {
        printHelp(cli);
        return;
    }

    const conf = await configure(argv, CWD);

    // --force
    if (argv.force) {
        conf.force = true;
    }

    try {
        // --watch
        if (argv.watch) {

            // Run once prior to watching...
            await runViaCli(conf);

            // Do not drop 'outDir' while watching. Dropping it would cause some
            // subsequent 3rd-party watchers on it to break (e.g. vuepress 1.x)
            conf.outDirDropOld = false;

            const watchDir = path.resolve(conf.srcDir, conf.baseDir);
            console.log(`Start watching ${watchDir}...`);
            const watcher = watch(watchDir, { ignoreInitial: true, interval: 200 })
                .on("add",    path => { console.log(`${path} added.`);   runViaCli(conf); })
                .on("change", path => { console.log(`${path} changed.`); runViaCli(conf); })
                .on("unlink", path => { console.log(`${path} deleted.`); runViaCli(conf); });
            const stopWatching = async () => {
                await watcher.close();
                console.log("Stopped watching.");
            };
            process.on("SIGINT", stopWatching);
        } else {
            await runViaCli(conf);
        }
    } catch (err) {
        if (err instanceof ConfigError) {
            console.log(err.message);
            console.log("ABORTED.\n");
            proc.exitCode = 0;
        } else {
            console.error(err);
            proc.exitCode = 1;
        }
        return;
    }
}

/**
 *
 * @param {*} argv key value map of CLI args
 * @param {*} cwd current working directory
 * @returns
 */
async function configure(argv, cwd) {

    const confDefault = getDefaultConfig();

    // --config
    let confPath = argv.config || "";
    let confDir  = cwd;
    let confUser = {};
    if (confPath) {
        try {
            confPath = path.resolve(cwd, confPath);
            confDir  = path.dirname(confPath);
            const confFile = await fs.readFile(confPath);
            const confData = JSON.parse(confFile);
            // --noupgrade
            if (!argv.noupgrade) {
                confUser = await upgrade(confData, confPath, confDefault);
            }
        } catch (e) {
            throw new Error(`Failed to read config '${confPath}'.\nReason:\n  ${e.message}\n`);
        }
    }

    // --deep
    if (argv.deep) {
        try {
            const confUserCli = JSON.parse(argv.deep.replace(/'/g, "\""));
            confUser = merge(confUser, confUserCli);
        } catch (e) {
            throw new Error(`Failed to parse value for --deep.\nReason:\n  ${e.message}\n`);
        }
    }
    // --shallow
    if (argv.shallow) {
        try {
            const confUserCli = JSON.parse(argv.shallow.replace(/'/g, "\""));
            confUser = Object.assign(confUser, confUserCli);
        } catch (e) {
            throw new Error(`Failed to parse value for --shallow.\nReason:\n  ${e.message}\n`);
        }
    }

    const conf = getRunnableConfig(confUser);

    // --init
    if (argv.init) {
        writeConf(conf, argv);
        proc.exit(0);
    }

    conf.srcDir = confDir;
    return conf;
}


// _/ Helpers \_________________________________________________________________

// --init
function writeConf(conf, argv) {

    let fileOpts = null;
    let replacer = null;

    // --local
    if (argv.local) {
        // append version path segment from schema URI to local path
        conf.$schema = `./node_modules/glossarify-md/conf/${conf.$schema.split("/conf/")[1]}`;
    } else {
        conf.$schema = conf.$schema.replace(/\/v(\.?\d){3}\/conf/, `/v${version}/conf`);
    }
    // --more
    if (argv.more) {
        delete conf.dev;
        fileOpts = { spaces: 2 };
    } else {
        // generate a minimal configuration
        replacer = (that, keyVal) => {
            if (typeof keyVal === "object") {
                const {$schema, baseDir, outDir} = keyVal;
                return {$schema, baseDir, outDir};
            } else {
                return keyVal;
            }
        };
        fileOpts = { spaces: 2, replacer };
    }

    // --new
    if (argv.new) {
        const glossaryFile = path.resolve(conf.baseDir, "glossary.md");
        const configFile = path.resolve(conf.baseDir, "../glossarify-md.conf.json");
        if (fs.pathExistsSync(glossaryFile)) {
            console.log(`⚠ Warning: ${glossaryFile} already exists. Nothing written.`);
        } else {
            fs.outputFileSync(glossaryFile, "# Glossary", "utf8");
        }
        if (fs.pathExistsSync(configFile)) {
            console.log(`⚠ Warning: ${configFile} already exists. Nothing written.`);
        } else {
            fs.writeJsonSync(configFile, conf, fileOpts);
        }
    } else {
        console.log(JSON.stringify(conf, replacer, 2));
    }
}

// --help
function printHelp(parameters) {
    console.log("Options:\n");
    console.log(
        Object
            .keys(parameters)
            .filter(key => key !== "dev")
            .sort((a, b) => a.localeCompare(b, "en"))
            .map(key => {
                const {alias, type, description, default:_default} = parameters[key];
                return `--${key}${alias ? ", --" + alias : ""} (${type})\n  Default: ${JSON.stringify(_default)}\n\n${description}\n\n`;
            })
            .join("")
    );
}
