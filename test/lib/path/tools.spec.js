import { strictEqual } from "node:assert";
import { relativeFromTo, toSystemSlash } from "../../../lib/path/tools.js";

(function testWhenFromAndToInDifferentBranch() {
    const from = "/home/user/foo/bar/baz.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = toSystemSlash("../../lorem/ipsum/dolor.md");
    const actual = toSystemSlash(relativeFromTo(from, to));
    strictEqual(actual, expected);
})();

(function testWhenFromIsInSubdirectoryDepth1() {
    const from = "/home/user/foo/baz.md";
    const to   = "/home/user/dolor.md";
    const expected = toSystemSlash("../dolor.md");
    const actual = toSystemSlash(relativeFromTo(from, to));
    strictEqual(actual, expected);

})();

(function testWhenFromIsInSubdirectoryDepth2() {
    const from = "/home/user/foo/bar/baz.md";
    const to   = "/home/user/dolor.md";
    const expected = toSystemSlash("../../dolor.md");
    const actual = toSystemSlash(relativeFromTo(from, to));
    strictEqual(actual, expected);

})();

(function testWhenToIsInSubdirectory() {
    const from = "/home/user/baz.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = toSystemSlash("./lorem/ipsum/dolor.md");
    const actual = toSystemSlash(relativeFromTo(from, to));
    strictEqual(actual, expected);
})();

(function testWhenFromAndToAreSiblings() {
    const from = "/home/user/foo.md";
    const to   = "/home/user/bar.md";
    const expected = toSystemSlash("./bar.md");
    const actual = toSystemSlash(relativeFromTo(from, to));
    strictEqual(actual, expected);

})();

(function testWhenFromAndToIsEqual() {
    const from = "/home/user/lorem/ipsum/dolor.md";
    const to   = "/home/user/lorem/ipsum/dolor.md";
    const expected = toSystemSlash("./");
    const actual = toSystemSlash(relativeFromTo(from, to));
    strictEqual(actual, expected);
})();
