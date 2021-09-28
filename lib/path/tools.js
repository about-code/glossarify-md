import path from "node:path";
import { cwd } from "node:process";
import url from "node:url";
import { VFile } from "vfile";

const CWD = cwd();
const forwSlashRegex = new RegExp("\\" + path.sep, "g");
const sysSlashRegex = new RegExp("/", "g");

/**
 * @typedef {import('./context')} Context
 */

export function toForwardSlash(p) {
    if (Array.isArray(p)) {
        return p.map(item => toForwardSlash(item));
    }
    return p.replace(forwSlashRegex, "/");
}

export function toSystemSlash(p) {
    if (Array.isArray(p)) {
        return p.map(item => toSystemSlash(item));
    }
    return p.replace(sysSlashRegex, path.sep);
}

/**
 * Returns the file path of a given VFile with toForwardSlash() applied. Use
 * toSystemSlash() to convert to OS-dependent path notation.
 *
 * @param {VFile} vFile
 */
export function getVFilePath(vFile) {
    return toForwardSlash(`${vFile.dirname}/${vFile.basename}`);
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
export function relativeFromTo(from, to) {
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
}

/**
 * Strips system or environment-dependent segments of a given `fullPath`.
 * Basically returns `path.relative(CWD, fullPath)`, which replaces any path
 * segments shared with the environment-specific current working directory.
 * Additionally, replaces system-dependent path separators using
 * `toForwardSlash()`. Further allows to provide a replacement string to give a
 * hint at the stripped ("redacted") path segments.
 *
 * Use this, e.g. for test outputs that must be equal across systems and CI
 * environments and must not contain system-dependent path information.
 *
 * @param {string} fullPath
 * @param {string} redactString
 */
export function toReproducablePath(fullPath, redactString) {
    redactString = redactString || "";
    return toForwardSlash(
        `${redactString}${path.sep}${path.relative(CWD, fullPath)}`
    );
}


/**
 * Returns the URL for the section heading preceding a term occurrence.
 *
 * @param {Context} context
 * @param {string} pathFrom (default = ".") source path of the link
 * @param {string} pathTo target path for the link
 * @param {string} anchor optional anchor or url fragment for references to sections
 */
export function getFileLinkUrl(context, pathFrom, pathTo, anchor) {
    const { outDir, linking } = context.conf;
    const { baseUrl, paths, pathComponents } = linking;
    let urlBase = "";
    let urlPath = "";
    let urlHash = "";

    if (anchor) {
        urlHash = anchor && anchor[0] === "#" ? anchor : `#${anchor}`;
    }
    if (paths === "relative") {
        const p = toForwardSlash(
            relativeFromTo(
                path.resolve(outDir, pathFrom || "."),
                path.resolve(outDir, pathTo)
            )
        );
        if (p !== "./") {
            urlPath = getPathFromComponents(p, pathComponents);
        } // else: inner link within the same file doesn't need a path
    } else if (paths === "absolute") {
        if (! baseUrl) {
            urlBase = "/";
            urlPath = toForwardSlash(path.resolve(outDir, pathTo));
            urlPath = getPathFromComponents(urlPath, pathComponents);
        } else if (baseUrl === "/") {
            urlBase = baseUrl;
            urlPath = toForwardSlash(path.resolve(outDir, pathTo)).replace(outDir, "");
            urlPath = getPathFromComponents(urlPath, pathComponents);
        } else {
            urlBase = url.format(new URL(baseUrl || "/"), { unicode: true });
            urlPath = toForwardSlash(path.resolve(outDir, pathTo)).replace(outDir, "");
            urlPath = getPathFromComponents(urlPath, pathComponents);
            const urlPlain = concatUrl(urlBase, urlPath, urlHash);
            return url.format(new URL(urlPlain), { unicode: true });
        }
    }
    return concatUrl(urlBase, urlPath, urlHash);
}

// const TRAILING_SLASHES = /^(.*)([/\\]{1,})$/;
const LEADING_SLASHES = /^([/\\]{1,})(.*)$/;

function getPathFromComponents(path, components) {
    if (path && components) {
        const vFile = new VFile({path: path});
        const pathTemplate = components.join(",");
        const ext  = /ext/.test(pathTemplate)  ? vFile.extname : "";
        const file = /file/.test(pathTemplate) ? vFile.stem : "";
        let path_  = /path/.test(pathTemplate) ? vFile.dirname + "/" : "";
        path_ = path_.replace(LEADING_SLASHES, "$2");
        return `${path_}${file}${ext}`;
    } else {
        return path;
    }
}
export function concatUrl(base = "", path = "", hash = "") {
    path = path.replace(LEADING_SLASHES, "$2"); // remove leading  slash
    return `${base}${path}${hash}`.trim();
}

export function urlPath(base, vFile) {
    return path
        .resolve(base, vFile.path || "")
        .replace(base, "")
        .replace(vFile.extname, "")
        .replace(LEADING_SLASHES, "$2");
}
