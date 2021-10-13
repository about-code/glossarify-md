import { relativeFromTo, toSystemSlash } from "../lib/path/tools.js";
const errors = [];

(function testWhenFromAndToInDifferentBranch() {
    const from = "/home/user/foo/bar/baz.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = toSystemSlash("../../lorem/ipsum/dolor.md");

    const actual = toSystemSlash(relativeFromTo(from, to));
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }

})();

(function testWhenFromIsInSubdirectoryDepth1() {
    const from = "/home/user/foo/baz.md";
    const to   = "/home/user/dolor.md";
    const expected = toSystemSlash("../dolor.md");

    const actual = toSystemSlash(relativeFromTo(from, to));
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }

})();

(function testWhenFromIsInSubdirectoryDepth2() {
    const from = "/home/user/foo/bar/baz.md";
    const to   = "/home/user/dolor.md";
    const expected = toSystemSlash("../../dolor.md");

    const actual = toSystemSlash(relativeFromTo(from, to));
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }

})();

(function testWhenToIsInSubdirectory() {
    const from = "/home/user/baz.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = toSystemSlash("./lorem/ipsum/dolor.md");

    const actual = toSystemSlash(relativeFromTo(from, to));
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }

})();

(function testWhenFromAndToAreSiblings() {
    const from = "/home/user/foo.md";
    const to   = "/home/user/bar.md";
    const expected = toSystemSlash("./bar.md");

    const actual = toSystemSlash(relativeFromTo(from, to));
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }

})();

(function testWhenFromAndToIsEqual() {
    const from = "/home/user/lorem/ipsum/dolor.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = toSystemSlash("./");

    const actual = toSystemSlash(relativeFromTo(from, to));
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }

})();

if (errors.length > 0) {
    console.log(errors);
    console.log("Tests failed with errors.");
    process.exit(1);
}
