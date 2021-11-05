import crypto from "node:crypto";

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

export function beginsWith(begin = "", str = "") {
    return str.substr(0, begin.length) === begin;
}
