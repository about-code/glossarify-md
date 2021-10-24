import crypto from "node:crypto";
import { readFile } from "node:fs";

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


export function readJsonFile(jsonFileName) {
    return new Promise((resolve, reject) => {
        readFile(jsonFileName, (err, jsonStr) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(jsonStr));
                } catch (parseErr) {
                    reject(parseErr);
                }
            }
        });
    });
}
