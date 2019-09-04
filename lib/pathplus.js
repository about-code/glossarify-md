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

module.exports = api;
