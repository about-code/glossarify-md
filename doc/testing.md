# Testing

*Prerequisites*

- `npm install` into `${workspace}/node_modules`
- `git` command is available
- `cd ./test`

```
npm run test
```

The `test` directory. It has the following structure:

```
${workspace}
  |- /test
  |  |- /input                    <-- test fixture
  |  |   |- glossary-md.conf.json <-- basic tests config
  |  |- /output-expected          <-- accepted baseline
  |  |- /output-actual            <-- actual test results
  |  |- package.json              <-- test scripts
  |- package.json                 <-- script dependencies
```

1. Running the test suite will create `output-actual` with the results of processing `input` with `glossarify-md.conf.json` and other configs.
1. `output-expected` is the *baseline* to compare `output-actual` against using `git diff`. If there are differences then the tests fail.
1. If the implementation changed the actual output probably deviates intentionally. If the produced diff is good and only contains intentional differences, then `output-actual` can be made the new *baseline* using
    ```
    npm run new-baseline
    ```
    or by manually renaming the new *output-actual* to
    *output-expected*.
1. Eventually the changes and new baseline should be committed using a commit message "*test: New baseline*" or the command

    ```
    npm run commit-baseline
    ```
    Note that the npm command only commits *test/output-expected* not any related files.
