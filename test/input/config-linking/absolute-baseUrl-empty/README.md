This test cannot be executed as part of the CI test suite since its goal is to
verify that an absolute filesystem path is generated which is different on each
system the test is executed.

To verify its acceptance criteria *manually* run it locally and compare results to acceptance criteria.

After cloning and installing project dependencies run

```
node ./bin/index.js --config ./test/input/config-tailored/config-linking/absolute-baseUrl-empty/glossarify-md.conf.json
```
