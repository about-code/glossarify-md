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

/**
 *
 * @param {*} str
 * @param {*} width when negative pad amount left else pad amount right
 * @param {*} pad
 * @returns
 */
export function pad(str, pad, width) {
    const size = `${str}`.length;
    const len = Math.abs(width) - size;
    if (len <= 0) { return str; }
    const fill = new Array(len);
    for (let i = 0;  i < len;  i++, fill[i] = `${pad}`) { /* noop */ }
    return width < 0
        ? `${fill.join("")}${str}`
        : `${str}${fill.join("")}`;
}
