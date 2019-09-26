# Contributing

## Table of Contents

1. [Preparing for Contributions](#preparing-for-contributions)
2. [Installing](#installing)
3. [Testing](#testing)
   1. [Basic Workflow](#basic-workflow)
   2. [Extending the Test Suite](#extending-the-test-suite)
4. [Debugging](#debugging)
   1. [Adding a Debug Configuration](#adding-a-debug-configuration)
   2. [Using a Remote Debugger](#using-a-remote-debugger)
   3. [Using Visual Studio Code](#debugging-in-visual-studio-code)
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

Any scripts and paths below assume you're in `${workspace}/test`
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
${workspace}/
   |- test/
   |   |- input/              <-- test fixture
   |   |- output-expected/    <-- accepted baseline
   |   |- output-actual/      <-- actual test results
   |   `- package.json        <-- test scripts
   `- package.json            <-- project dependencies
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

If you're testing a bugfix or a new feature you need

1. **one or more *document* input files...**
   - ...with term usages in sentences that specify the test case and acceptance criteria
   - ...with sentences adhering to a BDD-style syntax `GIVEN <condition> THEN <expectation> [AND (<expectation>)] [OR (<expectation>)]`
1. **one or more *glossary* input files ...**
   - ...with term definitions required for the test goal
1. **a glossarify-md *config* input file**...
   - ...refering to the glossary file in its `glossaries` section
     - extend `./input/feature/foo/glossarify-md.conf.json` if the feature under test has its own config
     - extend `./input/glossarify-md.conf.json` if the tests *don't need* a case-specific config
     - add a new config as described in the next section if you *need* a case-specific config

Rules of thumb:

- each bugfix or feature SHOULD have its own input directory with its own glossary and document input files reproducing the bug *before* implementing the bugfix
- sometimes bugs are the result of missing test cases in *exisiting* feature tests. If you think this is the case then you MAY add a test case to existing files

#### Running Tests with a Particular Configuration

If you need to test with a particular glossarify-md configuration then

1. add a new `./input/features/foo` directory or extend an existing one
1. add a new `./input/features/foo/glossarify-md.conf.json`
   ```json
   {
     "baseDir": ".",
     "outDir": "../../../output-actual/features/foo`,
   }
   ```
1. extend in `${workspace}/test/package.json`:
   - add a new `test-*` script
   - append ` && npm run test-*` to the `suite` script

## Debugging

Below we assume the following directory structure:

```
${workspace}/
  |- test/
  |   |- input/
  |   |     |- gitignore.files/                <-- debug input files (optional)
  |   |     |     |- document.md
  |   |     |     `- glossary.md
  |   |     |- glossarify-md.conf.json
  |   |     `- glossarify-md.gitignore.json    <-- debug config (tailored glossarify-md.conf.json)
  |   |
  |   |- output-gitignore.files/               <-- outDir to write debug outputs to (optional)>
  |   |- output-expected/                      <-- MUST NOT change for experimental debugging
  |   |- output-actual/                        <-- SHOULD NOT change for experimental debugging
  |   `- package.json                          <-- provides 'npm run debug' script
```

### Add a Debug Configuration

1. `cd` into `${workspace}/test/input`
1. Copy contents of `glossarify-md.conf.json` to `glossarify-md.gitignore.json`
1. Tailor the config to your needs, e.g. filter for test input files you want to debug

### Using a Remote Debugger

```
npm run debug
```

starts a remote debugging session on `127.0.0.1:9229`. Now connect with any debugger supporting the remote debugging protocol, e.g.

- *Chromium Browser* -> URL-Bar: `chrome://inspect`
- *Firefox Browser* -> URL-Bar: `about:debugging`
    - or ☰ Menu -> Web Developer Tools -> Remote Debugging (FF69+)
    - or ☰ Menu -> Web Developer Tools -> Connect...
- *VSCode*

### Using Visual Studio Code

The launch configuration example shows two debug options:

- VSCode connecting as a remote debugger (see previous section)
- VSCode internal debugging (recommended)

*${workspace}/.vscode/launch.json*
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug (internal)",
            "program": "${workspaceFolder}/bin/index.js",
            "args": [
                "--config",
                "./test/input/glossarify-md.gitignore.json"
            ]
        },
        {
            "type": "node",
            "request": "attach",
            "name": "Debug (remote)",
            "address": "127.0.0.1",
            "port": 9229,
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "${workspaceFolder}/bin/index.js"
        }
    ]
}
```

### Experimental Debugging

If you need input files for experiments you should not modify test input files. Rather copy them or write your own...

1. ...and put them into `gitignore.files`
1. ...and configure `glossarify-md.gitignore.json` like so:
    ```json
    {
        "baseDir": "./gitignore.files",
        "outDir": "../../output-gitignore.files",
        ...
    }
    ```
