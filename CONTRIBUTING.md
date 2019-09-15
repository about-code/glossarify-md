# Contributing

## Table of Contents

1. [Preparing for Contributions](#preparing-for-contributions)
2. [Installing](#installing)
3. [Testing](#testing)
   1. [Basic Workflow](#basic-workflow)
   2. [Extending the Test Suite](#extending-the-test-suite)
4. [Debugging](#debugging)

## Preparing for Contributions

*Prerequisites*

- `git` You can download git [here](https://git-scm.com).
- `node` and `npm`. You can download Node with npm [here](https://nodejs.org).
   - We aim to support the last two Node LTS releases ([Maintenance, Active](https://nodejs.org/en/about/releases/)) as well as the latest Non-LTS versions ([Current](https://nodejs.org/en/about/releases/)).
- Make yourself familiar with *[Collaborating with issues and pull requests](https://help.github.com/en/categories/collaborating-with-issues-and-pull-requests)* in the GitHub help, particularly with the *fork and pull* development model
- **Fork this repo**

## Installing

```
git clone https://github.com/<your-name>/glossarify-md
cd glossarify-md
npm install
cd ./test
npm test
```

> **Important:** Make sure to run tests successfully, locally on a fresh clone before you start editing. If tests fail (which should not happen but *might* happen due to unforseen platform issues or bugs) consider filing an issue and hold back contributions until the issue can be fixed. Otherwise leave a note in your pull request, at least. DO NOT commit a new baseline in this case. With a corrupted baseline the CI pipeline may run green when it shouldn't and tests lose their purpose of providing feedback to you and us about your changes.

## Testing

Any scripts and paths below assume you're in `${workspace}/test`. If you followed the Installation you're already there, otherwise begin with:
```
cd ./test
```
Then run:
```
npm test
```

> Windows users may use above command with the `git-bash` (being installed with
*Git*) or try running `npm run test-win` within `cmd`.

### Basic Workflow

The `test` directory has the following structure:

```
${workspace}
  |- /test
  |  |- /input                    <-- test fixture
  |  |- /output-expected          <-- accepted baseline
  |  |- /output-actual            <-- actual test results
  |  |- package.json              <-- test scripts
  |- package.json                 <-- script dependencies
```

1. Running the test suite will create a new folder `./output-actual` with the results of processing the contents in `./input`. Test results are *never* comitted.
1. `./output-expected` is the *baseline* compared against `./output-actual` using `git diff`. If there are any differences then the tests fail.
    > If the implementation changed the actual output might differ intentionally. In this case review the diff *carefully*. If it is good and only contains intended changes, then `./output-actual` can be made the new baseline using
    ```
    npm run new-baseline
    ```
    Windows users may have to run `npm run new-baseline-win`.


1. Eventually the new `./output-expected` baseline should be committed in a distinct commit with a message "*test: New baseline.*" or by entering

    ```
    npm run commit-baseline
    ```

### Extending the Test Suite

If you contribute a fix or extension to an existing feature you typically

- add a new term to some glossary
- add a new clause with the term to a non-glossary `.md`-file in BDD-like syntax: `GIVEN <condition> THEN <expectation> [AND (<expectation>)] [OR (<expectation>)]`. The main purpose is to express assumptions and preconditions and desired output. Feel free to use any wording between those keywords to make the intent of the test case reasonable. Try to use braces in case of complex logical expressions.

#### Adding a Glossary

Extend the `glossaries` section of a feature's own `glossarify-md.conf.json` if such config exists. Otherwise add a reference in `./input/glossarify-md.conf.json`. If you require a special configuration continue reading.

#### Testing a Particular Configuration

If you need to test a particular configuration setting, e.g.

1. add a new `./input/features/<xy>` directory or extend an existing one
1. add a new `glossarify-md.conf.json`.
   - `outDir` must point to `../../../output-actual/features/<xy>` with the path being relative to `baseDir: '.'`.
1. add a new `test-*` script in `${workspace}/test/package.json` which uses your config
    - extend the `suite` script to call your `test-*` script

## Debugging

### Option 1: Debugging with VSCode

If you're using VSCode then your VSCode launch configuration might look like
this:

*.vscode/launch.json*
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "VSCode Debugger",
            "program": "${workspaceFolder}/bin/index.js",
            "args": [
                "--config",
                "./test/input/glossarify-md.conf.json"
            ]
        }
    ]
}
```

### Option 2: Remote Debugging

```
npm run debug
```

in `${workspace}` runs the program for *remote debugging* on `127.0.0.1:9229`. You can now
connect with any debugger which supports the remote debugging protocol, e.g.

- *Chrome Browser* -> URL-Bar: `chrome://inspect`
- *Firefox Browser* -> URL-Bar: `about:debugging`
    - or ☰ Menu -> Web Developer Tools -> Remote Debugging (FF69+)
    - or ☰ Menu -> Web Developer Tools -> Connect...
- *VSCode* -> `.vscode/launch.json`
    ```json
    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "attach",
                "name": "Remote Debugging",
                "address": "127.0.0.1",
                "port": 9229,
                "localRoot": "${workspaceFolder}",
                "remoteRoot": "${workspaceFolder}/bin/index.js"
            }
        ]
    }
    ```
