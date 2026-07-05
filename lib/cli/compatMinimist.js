/**
 * Object mapper from glossarify-md's CLI options object structure onto
 * minimist options object structure.
 *
 * *glossarify-md*
 * ~~~
 * const cliOpts = {
 *   "config": {
 *       description: "Path to config file, e.g. './glossarify-md.conf.json'."
 *       ,type: "string"
 *       ,default: ""
 *       ,alias: "c"
 *   }
 *   ,"help": {
 *       description: "Display help."
 *       ,type: "boolean"
 *       ,default: false
 *       ,alias: ""
 *   }
 *   ...
 * }
 * ~~~
 *
 * *minimist*
 * ~~~
 * const minimistOpts = {
 *     string: ["config", ...]
 *     boolean: ["help"],
 *     alias: { "config": "c" }
 *     default: {
 *         "config": "",
 *         "help": false
 *     }
 * }
 * ~~~
 *
 * @param {*} opts
 */
export function toMinimistOpts(opts) {
    return Object.keys(opts).reduce((prev, key = "") => {
        const type = opts[key].type;
        if ("boolean" ===  type || "string" === type) {
            prev[type].push(key);
        }
        prev.default[key] = opts[key].default;
        prev.alias[key] = opts[key].alias;
        return prev;
    }, {
        string: []
        ,boolean: []
        ,alias: {}
        ,default: {}
    });
};
