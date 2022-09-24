import fs from "fs-extra";
import { strictEqual } from "node:assert";

const confProp = JSON.parse(fs.readFileSync("../conf/v5/schema.json")).properties;
let errors = [];

(function schemaShouldNotHaveDuplicateArgs() {
    let counter = {};
    function count(name) {
        if (name) {
            if (!counter[name]) {
                counter[name] = 1;
            } else {
                counter[name] += 1;
            }
        }

    }
    Object.keys(confProp)
        .forEach(name => {
            const alias = confProp[name].alias;
            count(alias);
        });

    errors = errors.concat(
        Object.keys(counter)
            .filter(name => counter[name] > 1)
            .map(name => new Error(`Ambiguous config option --${name}`))
    );

    strictEqual(errors.length, 0, "Ambiguous config options.");
})();
