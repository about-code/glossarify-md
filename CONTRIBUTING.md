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
./install-git-hooks.sh  // optional; Run tests prior to pushing.
```

> **⚠ Important:** Make sure to run `npm test` successfully, locally, on a fresh clone before you start coding. If tests fail (which should not happen but *might* happen due to unforseen platform issues or bugs) consider filing an issue and hold back contributions until the issue can be fixed or work on resolving those issues first. Do NOT just ignore it and commit new baselines in this case. This will corrupt the baseline and the CI pipeline might now going green when it shouldn't and tests lose their purpose of providing feedback to you and us about your changes.

## Testing

Any scripts and paths below assume you're in `${workspace}/test`, so if you aren't there yet:
```
cd ./test
```
Then run:
```
npm test
```

> As a Windows user run this command in a `git-bash` (being installed with Git) or in Windows Subsystem for Linux (WSL). Otherwise use `npm run test-win` in default command prompt `cmd`.

### Basic Workflow

The `test` directory has the following structure:

```
${workspace}/
   |- test/
   |   |- input/            <-- test suite
   |   |- output-actual/    <-- latest test results
   |   |- output-expected/  <-- currently accepted baseline
   |   `- package.json      <-- test dependencies and scripts
   `- package.json          <-- project dependencies
```

1. Running the test suite will create a new folder `./output-actual` with the results from processing `./input`. Actual test results are *never* comitted.
1. `./output-expected` is the *baseline* to compare `./output-actual` against using `git diff`. If there are any differences then tests fail. Mind the note above, regarding failures after a fresh clone.
1. extend/update test inputs *and* expected outputs. See also *Extending the Test Suite*
1. implement feature or bugfix
1. run tests against your implementation

    If you followed the guide so far then tests pass, because you described your expected output *previously* and now actual outputs match. **This is the ideal world you should strive for**.

    However, new tests may change many things which can be tedious to write (e.g. `terms.json`, dictionary dumps with terms and metadata extracted by *terminator*). Then it's more efficient to *review* changes.

    Your practical workflow will likely to be a mix of both, that is, an **expect-and-review workflow**:

    1. strive to make the diff causing tests to fail *minimal* by writing down expected output as much as you can anticipate based on the intent of your change
    1. review the remaining diff *carefully* for reasonable and unexpected changes (once or twice)
    1. tweak the implementation & rerun tests, review again
    1. if the diff is okay create a new baseline from `./output-actual` with
    ```
    npm run new-baseline      (Linux, Mac, Unix)
    npm run new-baseline-win  (Windows)
    ```

1. Commit a new baseline

    ```
    npm run commit-baseline
    ```

    > **☛ Note:** If you already staged files for commit using `git add` but didn't `git commit` them yet, then these files will be unstaged using `git reset`. *You won't lose any changes*. Just make sure to check your `git status` and `git add` them again before running a `git commit` afterwards.

### Extending the Test Suite

If you're testing a bugfix or a new feature you need

1. **one or more *document* files...**

   ...with term usages in sentences that specify the test case and acceptance criteria in a `GIVEN <condition> [AND|OR <condition>] THEN <expectation> [AND|OR <expectation>]` syntax
1. **one or more *glossary* files ...**

   ...with term definitions required for the test goal
1. **a *config* file**...

   ...whose `glossaries` section points to the glossary file(s)

> Convention
>
> Each bugfix or feature should have its distinct glossary and document input files

1. add a new `./input/foo-test` directory
1. add a new `./input/foo-test/glossarify-md.conf.json`
1. add a new test script in `${workspace}/test/package.json`
   - `"test_{#nr}": "npx . --config=./input/config-tailored/foo-test/glossarify-md.conf.json"`

*./input/foo-test/glossarify-md.conf.json (sample)*
```json
{
    "$schema": "../../../conf.schema.json",
    "baseDir": ".",
    "outDir": "../../output-actual/foo-test",
    "linking": "relative",
    "includeFiles": ["."],
    "excludeFiles": [],
    "glossaries": [
        { "file": "./glossary.md"}
    ],
    "dev": {
        "termsFile": "../../output-actual/foo-test/terms.json"
    }
}
```

## Debugging

Should you need to play around/analyse different inputs avoid changing the test suite. Instead set up  a *debug* folder and debug configuration as follows:

```
${workspace}/
   |- bin
   |- debug/        <-- create
   |   |- input/
   |   |   |- document.md
   |   |   |- glossary.md
   |   |- output/
   |   |- glossarify-md.conf.json
   |- doc
   |- ...
   `- package.json
```

*glossarify-md.conf.json*

```json
{
    "$schema": "../conf.schema.json",
    "baseDir": "./input",
    "outDir": "../output",
    "linking": "relative",
    "includeFiles": ["."],
    "excludeFiles": [],
    "glossaries": [
        { "file": "./glossary.md"}
    ],
    "dev": {
        "termsFile": "../output/terms.json",
        "printInputAst": true
    }
}
```

In a console at `${workspace}` type

```
npm run debug
```

This starts a remote debug session at `127.0.0.1:9229`. To debug with a configuration in another directory type:

```
npm run debug-cfg -- ./path/to/glossarify-md.conf.json
```

You can now connect e.g. with

- *Chrome Browser* ⇨ URL-Bar: `chrome://inspect`
- *VSCode* (attaching as a remote debugger)

The launch configuration example for [VSCode](https://code.visualstudio.com) below offers two debug options:

1. VSCode connecting as a remote debugger
1. VSCode internal debugging

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
                "./debug/glossarify-md.conf.json"
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

> **☛ Note**: If you need to create files outside the `debug/` folder, consider using a gitignore.\* prefix. Those files will be excluded from revision control.
