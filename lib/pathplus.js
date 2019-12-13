const path = require("path");
const proc = require("process");

const CWD = proc.cwd();
const api = {};
const forwSlashRegex = new RegExp("\\" + path.sep, "g");
const sysSlashRegex = new RegExp("/", "g");

api.toForwardSlash = function toForwardSlash(p) {
    if (Array.isArray(p)) {
        return p.map(item => toForwardSlash(item));
    }
    return p.replace(forwSlashRegex, "/");
}

api.toSystemSlash = function toSystemSlash(p) {
    if (Array.isArray(p)) {
        return p.map(item => toSystemSlash(item));
    }
    return p.replace(sysSlashRegex, path.sep);
};

/**
 * Caculates the path for 'to' relative to 'from'.
 *
 * Node's `path.relative(from, to)` method calculates the path
 * relative *to the current working directory* not relative to
 * 'from'. For example:
 *
 * Given:
 * - `home/user/lorem/foo.md` is `from`
 * - `home/user/lorem/ipsum/bar.md` is `to`
 * - `home/user/lorem` is `cwd`
 *
 * Then node's `path.relative(from, to)` counter-intuitively results in
 * `../ipsum/bar.md` instead of `./ipsum/bar.md`. In contrast this function
 * calculates relatively to `from` thus returning the expected latter path.
 *
 * @param {string} from absolute path
 * @param {string} to absolute path
 */
api.relativeFromTo = function(from, to) {
    const from_ = api.toForwardSlash(path.resolve(from)).split("/");
    const to_ = api.toForwardSlash(path.resolve(to)).split("/");
    let dirFrom, dirTo;
    do {
        dirFrom = from_.shift();
        dirTo = to_.shift();
    } while (                                                             // [1]
        dirFrom !== undefined
        && dirTo !== undefined
        && dirFrom === dirTo
    );
    if (dirTo !== undefined) {
        to_.unshift(dirTo);
    }
    const nav = from_.map(() => "../").join("") || "./";                  // [2]
    return api.toSystemSlash(`${nav}${to_.join("/")}`);

    // Implementation Notes:
    // [1] If this is no longer true, we reached a fork.
    // [2] Any segments remaning after shift() must be navigated up to the fork.
    // If there are no such segments, 'from' is *on* the path of 'to'.
}

api.toRedactedPath = function redactPath(fullPath, redactString) {
    redactString = redactString || "{redacted}";
    return `${path.sep}${redactString}${path.sep}${path.relative(CWD, fullPath)}`;
};

module.exports = api;
