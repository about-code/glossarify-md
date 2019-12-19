const path = require("path");
const proc = require("process");

const CWD = proc.cwd();
const forwSlashRegex = new RegExp("\\" + path.sep, "g");
const sysSlashRegex = new RegExp("/", "g");

toForwardSlash = function toForwardSlash(p) {
    if (Array.isArray(p)) {
        return p.map(item => toForwardSlash(item));
    }
    return p.replace(forwSlashRegex, "/");
}

toSystemSlash = function toSystemSlash(p) {
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
function relativeFromTo(from, to) {
    const from_ = toForwardSlash(path.resolve(from)).split("/");
    const to_ = toForwardSlash(path.resolve(to)).split("/");
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
    return toSystemSlash(`${nav}${to_.join("/")}`);

    // Implementation Notes:
    // [1] If this is no longer true, we reached a fork.
    // [2] Any segments remaning after shift() must be navigated up to the fork.
    // If there are no such segments, 'from' is *on* the path of 'to'.
}

function toRedactedPath(fullPath, redactString) {
    redactString = redactString || "{redacted}";
    return `${path.sep}${redactString}${path.sep}${path.relative(CWD, fullPath)}`;
};


/**
 * Returns the URL for the section heading preceding a term occurrence.
 *
 * @param {*} context
 * @param {string} filenameFrom path
 * @param {string} filenameTo path
 * @param {string} anchor optional anchor or url fragment for references to sections
 */
function getFileLinkUrl(context, filenameFrom, filenameTo, anchor) {
    const {outDir, baseUrl, linking, generateFiles} = context.opts;
    let targetUrl = "";
    if (linking === 'relative') {
        targetUrl = toForwardSlash(
            relativeFromTo(
                path.resolve(outDir, filenameFrom || "."),
                path.resolve(outDir, filenameTo)
            )
        ) + anchor;
    } else if (linking === 'absolute') {
        if (baseUrl) {
            targetUrl = toForwardSlash(path.resolve(outDir, filenameFrom))
                .replace(outDir, baseUrl)
                .replace(/^(.*)(\/|\\)$/, "$1")
                + anchor;
        } else {
            targetUrl = toForwardSlash(path.resolve(outDir, filenameFrom))
                + anchor;
        }
    } else {
        targetUrl = anchor;
    }
    return url.parse(targetUrl).format();
}

module.exports = {
    toForwardSlash
    , toSystemSlash
    , relativeFromTo
    , getFileLinkUrl
    , toRedactedPath
};
