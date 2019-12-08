const path = require("path");
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
}

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
    from_.pop();                                                          // [2]
    const fromUp = from_.map(() => "../").join("");                       // [3]
    const relation = fromUp ? "../" + fromUp : "./";
    return api.toSystemSlash(`${relation}${to_.join("/")}`);

    // Implementation Notes:
    // [1] If this is no longer true, we reached a fork.
    // [2] Last element of 'from' is not relevant to path construction.
    // [3] Any segments remaning after shift() must be navigated up to the fork.
    // If there are no such segments, 'from' is *on* the path of 'to'.
}

module.exports = api;
