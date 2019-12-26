const process = require("process");
const opts = require("../conf.schema.json").properties;
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
    Object.keys(opts)
        .forEach(name => {
            const alias = opts[name].alias;
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
