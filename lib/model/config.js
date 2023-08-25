import merge from "deepmerge";
import path from "node:path";
import proc from "node:process";
import { createRequire } from "node:module";
import { toForwardSlash } from "../path/tools.js";
import { NO_BASEDIR, NO_OUTDIR, OUTDIR_IS_BASEDIR, OUTDIR_IS_BASEDIR_WITH_DROP } from "../cli/messages.js";
import { ConfigError } from "./errors.js";

// Init default values from external configuration schema, once.
const require_ = createRequire(import.meta.url);
const confSchema = require_("../../conf/v5/schema.json");
const confSchemaProps = confSchema.properties;
const confDefault = Object
    .keys(confSchemaProps)
    .reduce((obj, key) => {
        // Set up a default config from default values in the config schema.
        obj[key] = confSchemaProps[key].default;
        return obj;
    }, { "$schema": confSchema.$id });


/**
 * @returns {object} The default configuration derived from defaults in the
 * the external configuation schema.
 */
export function getDefaultConfig() {
    return confDefault;
}


/**
 * Merges a potentially incomplete user-provided configuration with the
 * default configuration.
 *
 * @param {object} userConf
 * @returns {object} A user-provided configuration with defaults for options
 * not provided by the user.
 */
export function getRunnableConfig(userConf) {
    const defaultConf = getDefaultConfig();

    // Make sure to use defaults from config schema when user
    // does not provide relevant options by merging user configuration
    // into default configuration.
    const conf = merge(defaultConf, userConf, {
        clone: false
        , arrayMerge: (_default, curConf) => {
            return curConf && curConf.length > 0 ? curConf : _default;
        }
    });
    return conf;
}

/**
 * Maps a config adhering to the external config schema onto a slightly
 * modified schema optimized for accessing config values at runtime.
 * Meant to be used internally, only.
 *
 * Initializes essential hard coded defaults as a last resort and in addition
 * to sensible defaults which should have already been applied to the given
 * configuration. Initializes additional default values which can not
 * be provided, statically.
 *
 * @param {object} conf A configuration adhering to the external config schema
 * @returns {object} A configuration adhering to an internal runtime-optimized config schema
 */
export function getRuntimeConfig(conf) {

    const _conf = {
        ...conf
        ,baseDir: toForwardSlash(conf.baseDir || "")
        ,outDir: toForwardSlash(conf.outDir  || "")
        ,indexing: {
            ...conf.indexing
            ,headingDepths: arrayToMap(conf.indexing.headingDepths)
        }
        ,linking: {
            ...conf.linking
            ,headingDepths: arrayToMap(conf.linking.headingDepths)
            ,limitByTermOrigin: arrayToMap(conf.linking.limitByTermOrigin)
            ,pathRewrites: reverseMultiValueMap(conf.linking.pathRewrites)
            ,sortAlternatives: {
                by: "glossary-filename"
                ,...conf.linking.sortAlternatives
            }
        }
    };

    // When a configuration has been loaded from a file then srcDir
    // is meant to be the directory of the configuration file.
    if (! conf.srcDir) {
        conf.srcDir = proc.cwd();
    }
    // Resolve baseDir relative to config file src directory
    // Resolve outDir relative to baseDir.
    _conf.baseDir = path.resolve(conf.srcDir, conf.baseDir);
    _conf.outDir  = path.resolve(_conf.baseDir, conf.outDir);

    console.log(`☛ Reading from: ${_conf.baseDir}`);
    console.log(`☛ Writing to:   ${_conf.outDir}\n`);

    // limit link creation for alternative definitions
    const altLinks = _conf.linking.limitByAlternatives;
    if (Math.abs(altLinks) > 95) {
        _conf.linking.limitByAlternatives = Math.sign(altLinks) * 95;
    }
    const sortAlternatives = _conf.linking.sortAlternatives;
    if (sortAlternatives.by === "glossary-ref-count") {
        _conf.linking.sortAlternatives = { perSectionDepth: 2, ...sortAlternatives };
    }
    if (conf.generateFiles.listOfFigures) {
        _conf.generateFiles.listOfFigures = { class: "figure", title: "Figures", ...conf.generateFiles.listOfFigures };
        _conf.generateFiles.listOf.push(conf.generateFiles.listOfFigures);
    }
    if (conf.generateFiles.listOfTables) {
        _conf.generateFiles.listOfTables = { class: "table", title: "Tables", ...conf.generateFiles.listOfTables };
        _conf.generateFiles.listOf.push(conf.generateFiles.listOfTables);
    }
    if (_conf.unified.rcPath) {
        _conf.unified.rcPath = toForwardSlash(path.resolve(conf.baseDir, conf.unified.rcPath));
    }

    validateRuntimeConfig(_conf);

    return _conf;
}

// _/ Helpers \_________________________________________________________________

/**
 * Validates a given configuration and tests whether it is a
 * runnable configuration.
 *
 * @param {object} conf
 */
function validateRuntimeConfig(conf) {

    if (conf.baseDir === "") {
        throw new ConfigError(NO_BASEDIR);
    }

    if (conf.outDir === "") {
        throw new ConfigError(NO_OUTDIR);
    }

    if (conf.outDir === conf.baseDir) {
        if (conf.outDirDropOld) {
            throw new ConfigError(OUTDIR_IS_BASEDIR_WITH_DROP);
        } else if (!conf.force) {
            throw new ConfigError(OUTDIR_IS_BASEDIR);
        }
    }
}

function arrayToMap(array) {
    return array.reduce((prev, curr) => {
        prev[curr] = true;
        return prev;
    }, {});
}

/**
 * Transforms a map
 * {
 *    "key1": ["value1", "value2", "value3"],
 *    "key2": ["value1", "valueA", "valueB"],
 *    "key3": "value%"
 * }
 * to a map
 * {
 *    "value1": "key2",
 *    "value2": "key",
 *    "value3": "key",
 *    "valueA": "key2",
 *    "valueB": "key2",
 *    "value%": "key3"
 * }
 */
function reverseMultiValueMap(input) {
    const output = {};
    for (const key in input) {
        if (input[key]) {
            const values = [].concat(input[key]); // [1]
            for (let i = 0, len = values.length; i < len; i++) {
                const value = values[i];
                output[value] = key;
            }
        }
    }
    return output;

    // ___/ Implementation Notes \___
    // [1] use .concat() to wrap non-array %value% into [ "%value%" ].
    //     Won't work with something like [... input[key]].
}
