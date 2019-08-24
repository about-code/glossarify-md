# Testing

*Prerequisites*

- Dependencies have been installed with `npm install`
- `git` command is available

```
npm run test
```

Test data is located in the `test` directory. The directory has the following
structure:

```
${workspace}
    |- /test
    |    |- /input
    |    |- /output-expected
    |    |- /output-actual          <-- after test run
    |    |- glossarify-md.conf.json
    |- ...
    |- package.json
```

> Currently only a single configuration for the
> basic use cases can be tested. This will be improved in the future.

1. Running the test will create `output-actual` with the results of processing `input` as configured in `glossarify-md.conf.json`.
1. `output-expected` is the *baseline* compared against `output-actual` using `git diff`. If there are differences then the tests fail.
1. If the implementation changed the actual output probably deviates intentionally. If the produced diff only contains intended differences, then `output-actual` can be made the new *baseline* using
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
