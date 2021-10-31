import crypto from "node:crypto";
import { readFile } from "node:fs";
import https from "node:https";
import path from "node:path";

/**
 * Returns a *practically collision free* hash with a length of 8 character
 * using some cryptographic hash algorithm.
 *
 * @param {string} value The value to hash.
 * @returns
 */
export function getHash8(value) {
    return crypto.createHash("md5")
        .update(value)
        .digest("hex")
        .toString()
        .substr(0, 8);
}


/**
 * Reads and parses a JSON file from a local path (relative to baseDir) or from
 * an https:// or file:// URL. Other URL schemes (including http://) are not
 * supported.
 *
 * @param {string} jsonFileNameOrUrl
 * @param {string} baseDir
 * @returns Promise<any>
 */
export function readJsonFile(jsonFileNameOrUrl, baseDir) {
    let promise;
    const httpsScheme = "https://";
    const httpScheme = "http://";
    const fileScheme = "file://";
    if (jsonFileNameOrUrl.substr(0, httpsScheme.length) === httpsScheme) {
        promise = readJsonFileUrl(jsonFileNameOrUrl);
    } else if (jsonFileNameOrUrl.substr(0, httpScheme.length) === httpScheme) {
        promise = Promise.reject(`Reading files from ${httpScheme} URL not supported. Use ${httpsScheme} or ${fileScheme} URLs or filesystem paths.`);
    } else {
        promise = new Promise((resolve, reject) => {
            const cb = (err, jsonStr) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        resolve(jsonStr);
                    } catch (parseErr) {
                        reject(parseErr);
                    }
                }
            };
            if (jsonFileNameOrUrl.substr(0, fileScheme.length) === fileScheme) {
                readFile(jsonFileNameOrUrl, cb);
            } else {
                readFile(path.resolve(baseDir, jsonFileNameOrUrl), cb);
            }
        });
    }
    return promise.then(jsonStr => JSON.parse(jsonStr));
}

const contentTypes = ["application/json", "application/ld+json", "text/plain"];
const contentTypesAccept = contentTypes.map((type, idx) => `${type}${idx > 0 ? ";q=" + (1.0 - idx * 0.1) : ""}`).join(", ");
const contentTypesTest = new RegExp(`(${contentTypes.join("|")})`);
function readJsonFileUrl(jsonFileUrl) {
    return new Promise((resolve, reject) => {
        let url;
        try {
            url = new URL(jsonFileUrl);
        } catch (err) {
            return reject();
        }
        try {
            console.log(`GET ${url.toString()}`);
            let jsonStr = "";
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
                    res.on("data", chunk => jsonStr += chunk);
                    res.on("end", () => {
                        console.log("Finished.");
                        resolve(jsonStr);
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
