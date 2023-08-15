import { strictEqual } from "node:assert";
import { pad } from "../../../lib/text/tools.js";

(function it_should_pad_text_to_the_left() {
    const given = "foo";
    const expected = "oofoo";
    const actual = pad(given, "o", -5);
    strictEqual(actual, expected);
})();

(function it_should_pad_text_to_the_right() {
    const given = "foo";
    const expected = "foooo";
    const actual = pad(given, "o", 5);
    strictEqual(actual, expected);
})();
