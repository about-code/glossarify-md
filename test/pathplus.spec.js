const {relativeFromTo} = require("../lib/pathplus");
const errors = [];

(function testWhenFromAndToInDifferentBranch() {
    const from = "/home/user/foo/bar/baz.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = "../../lorem/ipsum/dolor.md";

    const actual = relativeFromTo(from, to);
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }
})();

(function testWhenFromIsInSubdirectoryDepth1() {
    const from = "/home/user/foo/baz.md";
    const to   = "/home/user/dolor.md";
    const expected = "../dolor.md";

    const actual = relativeFromTo(from, to);
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }
})();

(function testWhenFromIsInSubdirectoryDepth2() {
    const from = "/home/user/foo/bar/baz.md";
    const to   = "/home/user/dolor.md";
    const expected = "../../dolor.md";

    const actual = relativeFromTo(from, to);
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }
})();

(function testWhenToIsInSubdirectory() {
    const from = "/home/user/baz.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = "./lorem/ipsum/dolor.md";

    const actual = relativeFromTo(from, to);
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }
})();

(function testWhenFromAndToAreSiblings() {
    const from = "/home/user/foo.md";
    const to   = "/home/user/bar.md";
    const expected = "./bar.md";

    const actual = relativeFromTo(from, to);
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }
})();

(function testWhenFromAndToIsEqual() {
    const from = "/home/user/lorem/ipsum/dolor.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = "./";

    const actual = relativeFromTo(from, to);
    if (actual !== expected) {
        errors.push(new Error(`Expected is "${expected}" but actual is "${actual}"`));
    }
})();

if(errors.length > 0) {
    console.log(errors);
    console.log("Tests failed with errors.");
    process.exit(1);
};
