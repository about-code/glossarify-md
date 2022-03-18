import fs, { readFile } from "node:fs";
import https from "node:https";
import path from "node:path";
import url from "node:url";
import { VFile } from "vfile";

// const TRAILING_SLASHES = /^(.*)([/\\]{1,})$/;
const LEADING_SLASHES = /^([/\\]{1,})(.*)$/;
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
    return toForwardSlash(`${vFile.cwd}/${vFile.path}`);
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
export function relativeFromTo(from, to, baseDir = "") {
    let from_, to_;
    if (baseDir) {
        from_ = toForwardSlash(path.resolve(baseDir, from)).split("/");
        to_   = toForwardSlash(path.resolve(baseDir, to)).split("/");
    } else {
        from_ = toForwardSlash(path.resolve(from)).split("/");
        to_   = toForwardSlash(path.resolve(to)).split("/");
    }
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
    if (dirFrom !== undefined) {
        try {
            if (fs.statSync(from).isDirectory()) {
                from_.unshift(dirFrom);
            }
        } catch (err) {
            // ignorable
        }
    }
    const nav = from_.map(() => "../").join("") || "./";                  // [3]
    return `${nav}${to_.join("/")}`;

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
 * Determins whether a path from 'from' to 'to' reveals a parent-child or
 * child-parent or sibling relationship between two files.
 * @param {string} from absolute path
 * @param {string} to absolute path
 */
export function isParentOrChildOrSibling(from, to) {
    const pathRelative = relativeFromTo(from, to);
    const pathSegments = pathRelative.split("/");
    pathSegments.pop(); // remove file name
    let seg = pathSegments.shift();
    if (seg === ".") {
        return true; // Child or Sibling
    }
    while (seg === "..") {
        seg = pathSegments.shift();
    }
    if (seg === undefined) {
        return true; // Parent
    } else {
        return false; // Aunt
    }
}

/**
 * Classifies the path relationship of two *files* from the perspective of `to`.
 * For example when `from` is a file in an upper directory, then `to` is
 * considered a child of `from`.
 *
 *
 * @param {string} from
 * @param {string} to
 * @returns {"self"|"parent"|"child"|"sibling"|"parent-sibling"}
 */
export function classifyRelationshipFromTo(from, to) {
    const pathRelative = relativeFromTo(from, to);
    const pathSegments = pathRelative.split("/");
    const fileName = pathSegments.pop();
    let seg = pathSegments.shift();
    if (seg === ".") {
        if (pathSegments.length === 0) {
            return from.substring(from.length - fileName.length) === fileName ? "self" : "sibling";
        } else {
            return "child";
        }
    }
    while (seg === "..") {
        seg = pathSegments.shift();
    }
    return seg === undefined ? "parent" : "parent-sibling";
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
export function toReproducablePath(from, to, redactString) {
    redactString = redactString || "";
    // return toForwardSlash(
    //     `${redactString}${path.sep}${path.relative(CWD, fullPath)}`
    // );
    const result = toForwardSlash(to)
        .replace(toForwardSlash(from), redactString)
        .replace(LEADING_SLASHES, "$2");
    if (result && result !== to) {
        return result;
    } else {
        return to;
    }
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
        const p = relativeFromTo(
            path.resolve(outDir, pathFrom || "."),
            path.resolve(outDir, pathTo)
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

function getPathFromComponents(path, components) {
    if (path && components) {
        const vFile = new VFile({ path: path });
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

/**
 * Given
 * ~~~
 * baseDir = /home/user/foo/,
 * targetFile = /home/user/foo/bar/baz.md
 * ~~~
 * then the function returns a path `bar/baz.md` due to
 *
 * @param {*} from
 * @param {*} to
 * @returns
 */
export function getUrlPath(from, to) {
    const from_ = toForwardSlash(from || "");
    const to_   = toForwardSlash(to || "");
    return toForwardSlash(path.resolve(from_, to_))
        .replace(from_, "")
        .replace(LEADING_SLASHES, "$2");
}


export async function readJsonFile(jsonFileNameOrUrl, baseDir) {
    const contentTypes = [ "application/json", "application/ld+json", "text/plain" ];
    const contentTypesTest = new RegExp(`(${contentTypes.join("|").replace("+", "\\+")})`);

    const { content, contentType } = await readTextFile(jsonFileNameOrUrl, baseDir, contentTypes);
    if (! contentTypesTest.test(contentType)) {
        throw `Undefined or unsupported content type "${contentType}" for resource "${jsonFileNameOrUrl}".`;
    } else {
        return JSON.parse(content);
    }
}

/**
 * Reads and parses a JSON file from a local path (relative to baseDir) or from
 * an https:// or file:// URL. Other URL schemes (including http://) are not
 * supported.
 *
 * @param {string} textFileNameOrUrl (only https:// or file://)
 * @param {string} baseDir
 * @returns {Promise<{content: string, contentType: string}>} Promises an object with content and contentType property.
 */
export function readTextFile(textFileNameOrUrl, baseDir, contentTypes = []) {
    const fileScheme = "file://";
    const httpScheme = "http://";
    const httpsScheme = "https://";
    if (textFileNameOrUrl.match(new RegExp(`^(${httpsScheme}|${fileScheme})`))) {
        // https://
        return readTextFileUrl(textFileNameOrUrl, contentTypes);
    } else if (textFileNameOrUrl.substr(0, httpScheme.length) === httpScheme) {
        // http://
        return Promise.reject(`Reading files from ${httpScheme} URL not supported. Use ${httpsScheme} or ${fileScheme} URLs or filesystem paths.`);
    } else {
        // file:// and none...
        return new Promise((resolve, reject) => {
            const cb = (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    let contentType;
                    if (textFileNameOrUrl.match(/\.json$/)) {
                        contentType = "application/json";
                    } else if (textFileNameOrUrl.match(/\.jsonld$/)) {
                        contentType = "application/ld+json";
                    } else if (textFileNameOrUrl.match(/\.nq$/)) {
                        contentType = "application/n-quads";
                    } else {
                        contentType = "text/plain";
                    }
                    resolve({ contentType, content });
                }
            };
            if (textFileNameOrUrl.substr(0, fileScheme.length) === fileScheme) {
                readFile(textFileNameOrUrl, cb);
            } else {
                readFile(path.resolve(baseDir, textFileNameOrUrl), cb);
            }
        });
    }
}

/**
 * @param {string} jsonFileUrl
 * @param {string[]} contentTypes An array of up to 10 content types in weighted order.
 */
function readTextFileUrl(jsonFileUrl, contentTypes = [ "application/json", "text/plain" ]) {
    return new Promise((resolve, reject) => {

        /*
         * For up to 10 content types build a quality-weighted HTTP Accept header string.
         * ~~~
         * mime/type1, mime/type2;q=0.9, mime/type3;q=0.8, ...
         * ~~~
         */
        const contentTypesAccept = contentTypes
            .slice(0, 9)
            .map((type, i) => `${type}${i > 0 ? ";q=" + (1.0 - i * 0.1) : ""}`)
            .join(", ");
        const contentTypesTest = new RegExp(`(${contentTypes.join("|").replace("+", "\\+")})`);

        try {
            console.log(`GET ${jsonFileUrl}`);
            let content = "";
            const url = new URL(jsonFileUrl);
            const req = https
                .get(url, {
                    headers: {
                        "Accept": contentTypesAccept
                        ,"Accept-Charset": "utf-8"
                        ,"Cache-Control": "no-cache"
                    }
                }, (res) => {
                    const contentType = res.headers["content-type"] || res.headers["Content-Type"] || "";
                    if (! contentType.match(contentTypesTest)) {
                        req.destroy(`Invalid response. Expecting "Content-Type" header matching expression "${contentTypesTest}" but got "${contentType}".`);
                        reject(`Invalid response. Expecting "Content-Type" header matching expression "${contentTypesTest}" but got "${contentType}".`);
                    }
                    res.on("data", chunk => content += chunk);
                    res.on("end", () => {
                        console.log("Finished.");
                        resolve({ contentType, content });
                    });
                    res.on("error", reject);
                })
                .on("error", reject);
            req.setTimeout(30000, () => {
                reject("Connection timed out.");
            });
        } catch (err) {
            reject(err);
        }
    });
}
