import merge from "deepmerge";
import path from "node:path";
import proc from "node:process";
import { createRequire } from "node:module";
import { toForwardSlash } from "../path/tools.js";
import { NO_BASEDIR, NO_OUTDIR, OUTDIR_IS_BASEDIR, OUTDIR_IS_BASEDIR_WITH_DROP } from "../lib/cli/messages.js";

// Init default values from external configuration schema, once.
const require_ = createRequire(import.meta.url);
const confSchema = require_("../conf/v5/schema.json");
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

    _conf.baseDir = path.resolve(proc.cwd(), conf.baseDir);
    _conf.outDir  = path.resolve(conf.baseDir, conf.outDir);

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

    return _conf;
}

// _/ Helpers \_________________________________________________________________

/**
 * Validates a given configuration and tests whether it is a
 * runnable configuration.
 *
 * @param {object} conf
 */
export function validateConfig(conf) {

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
        } else if (!conf.force) {
            console.log(OUTDIR_IS_BASEDIR);
            console.log("ABORTED.\n");
            proc.exit(0);
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
