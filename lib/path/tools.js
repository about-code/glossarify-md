const path = require("path");
const url = require("url");
const CWD = require("process").cwd();

const api = {};
const forwSlashRegex = new RegExp("\\" + path.sep, "g");
const sysSlashRegex = new RegExp("/", "g");

/**
 * @typedef {import('./context')} Context
 */

api.toForwardSlash = function toForwardSlash(p) {
    if (Array.isArray(p)) {
        return p.map(item => toForwardSlash(item));
    }
    return p.replace(forwSlashRegex, "/");
};

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
api.relativeFromTo = function relativeFromTo(from, to) {
    const { toForwardSlash, toSystemSlash } = api;
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
    if (dirTo !== undefined) {                                            // [2]
        to_.unshift(dirTo);
    }

    const nav = from_.map(() => "../").join("") || "./";                  // [3]
    return toSystemSlash(`${nav}${to_.join("/")}`);

    // Implementation Notes:
    // [1] If the while-loop stops finding equal path segments, it's at a fork.
    // [2] If this is true, 'to_' is not just a parent of 'from_' but in a
    // different branch. If the while-loop detects a fork it has already removed
    // one path segment too much, because it shifts (drops) first, then compares
    // and detects the difference in path segment names. So unshift the last
    // shifted segment again at the beginning of the path segments array 'to_'.
    // [3] If 'from_' has remaining segments, then it's _deeper or in another
    // branch_ of the file system tree than 'to_' so beginning at 'from_' we
    // must navigate "upwards" up to where branches fork. We must navigate
    // exactly as much upwards as segments remained after dropping (shift())
    // all path segments 'from_' and 'to_' have in common. If there remain no
    // such segments, 'from' is *on* the path of 'to' (it's _upper_ in the tree).
};

/**
 * Strips system or environment-dependent segments of a given `fullPath`.
 * Basically returns `path.relative(CWD, fullPath)`, which replaces any path
 * segments shared with the environment-specific current working directory.
 * Additionally, replaces system-dependent path separators using
 * `toForwardSlash()`. Further allows to provide a replacement string to give a
 * hint at the stripped ("redacted") path segments.
 *
 * Use this, e.g. for test outputs that must be equal accross systems and CI
 * environments and must not contain system-dependent path information.
 *
 * @param {string} fullPath
 * @param {string} redactString
 */
api.toReproducablePath = function toReproducablePath(fullPath, redactString) {
    redactString = redactString || "";
    return api.toForwardSlash(
        `${redactString}${path.sep}${path.relative(CWD, fullPath)}`
    );
};


/**
 * Returns the URL for the section heading preceding a term occurrence.
 *
 * @param {Context} context
 * @param {string} pathFrom (default = ".") source path of the link
 * @param {string} pathTo target path for the link
 * @param {string} anchor optional anchor or url fragment for references to sections
 */
api.getFileLinkUrl = function getFileLinkUrl(context, pathFrom, pathTo, anchor) {
    const { relativeFromTo, toForwardSlash } = api;
    const { outDir, baseUrl, linking } = context.opts;
    let targetUrl = "";
    if (! anchor) {
        anchor = "";
    }
    if (anchor[0] !== "#") {
        anchor = `#${anchor}`;
    }
    if (linking === "relative") {
        targetUrl = toForwardSlash(
            relativeFromTo(
                path.resolve(outDir, pathFrom || "."),
                path.resolve(outDir, pathTo)
            )
        );
        if (targetUrl === "./") {
            // link within the same file
            targetUrl = anchor;
        } else {
            targetUrl += anchor;
        }
    } else if (linking === "absolute") {
        if (baseUrl) {
            targetUrl = toForwardSlash(path.resolve(outDir, pathTo))
                .replace(outDir, baseUrl)
                .replace(/^(.*)(\/|\\)$/, "$1")
                + anchor;
        } else {
            targetUrl = toForwardSlash(path.resolve(outDir, pathTo))
                + anchor;
        }
    } else {
        targetUrl = anchor;
    }
    return url.parse(targetUrl).format();
};

module.exports = api;
