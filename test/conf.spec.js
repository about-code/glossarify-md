const process = require("process");
const confProp = require("../conf/v5/schema.json").properties;
let errors = [];

(function testNoDuplicateArgs() {
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
})();

if (errors.length > 0) {
    console.log(errors);
    console.log("Tests failed with errors.");
    process.exit(1);
}
