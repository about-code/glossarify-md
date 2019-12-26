# Contributing

## Table of Contents

1. [Preparing for Contributions](#preparing-for-contributions)
1. [Installing](#installing)
1. [Workflow](#workflow)
1. [Testing](#testing)
    1. [Directory Structure](#directory-structure)
    1. [Extending the Test Suite](#extending-the-test-suite)
1. [Debugging](#debugging)

## Preparing for Contributions

- Make yourself familiar with *[Collaborating with issues and pull requests](https://help.github.com/en/categories/collaborating-with-issues-and-pull-requests)* in the GitHub help, particularly with the *fork and pull* development model
- **[Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repo on GitHub**

## Installing

*Prerequisites*
- [`git`](https://git-scm.com)
- [`node` and `npm`](https://nodejs.org) - we aim to support the last two Node LTS releases ([Maintenance, Active](https://nodejs.org/en/about/releases/)) as well as the latest Non-LTS versions ([Current](https://nodejs.org/en/about/releases/))
- Editor of your choice, e.g. [Atom](https://atom.io), [VSCode](https://code.visualstudio.com), etc.

> **⚠ Important (Windows-Users):** Configure your editor or IDE to use Unix-style line-endings (LF) for this project. Unix-Style-Endings are required at least for *Markdown*, *JS* and *JSON* files.

```
git clone https://github.com/<your-name>/glossarify-md
cd glossarify-md
./install-git-hooks.sh  // optional; Run tests prior to pushing.
npm install
cd ./test
npm install
```

> **⚠ Important:** Make sure to run `npm test` successfully, locally, on a fresh clone before you start coding. If tests fail (which should not happen but *might* happen due to unforseen platform issues or bugs) consider filing an issue and hold back contributions until the issue can be fixed or work on resolving those issues first. Do NOT just ignore it and commit new baselines in this case. This will corrupt the baseline and the CI pipeline might now going green when it shouldn't and tests lose their purpose of providing feedback to you and us about your changes.

## Workflow

1. Run the test suite. This will create a new folder `./output-actual` with the results from processing `./input`. Actual test results are *never* comitted. If you have not yet changed anything, tests should pass.
1. `./output-expected` is the *baseline* which `./output-actual` is compared against using `git diff`. If there are any differences then tests fail.
1. When adding a new feature extend/update test inputs and expected outputs first ("test-first"). See [Testing](#testing) below.
1. Implement the feature or bugfix
1. Run tests against your implementation

    If you followed the guide so far then, ideally, tests pass because your expected output now matches the actual output. **This is what you should strive for**.

    However, often more things changed than you probably anticipated, including generated files which are tedious to write by hand (e.g. dictionary dumps in `terms.json` files). Then you have to *review* those changes.

    Your typical workflow therefore will likely be an **expect-and-review workflow**:

    1. strive to make the diff causing tests to fail *minimal* by writing down expected output as much as you can anticipate based on the intent of your change
    1. review the remaining diff *carefully* for reasonable and unexpected changes (once or twice)
    1. tweak the implementation & rerun tests, review again
    1. if the diff is okay create a new baseline from `./output-actual` with
    ```
    npm run new-baseline      (Linux, Mac, Unix)
    npm run new-baseline-win  (Windows)
    ```

1. Commit changes to the implementation using [conventional commit messages](https://www.conventionalcommits.org/)

   - the commit with the fix must have a message

     `fix: <issue-title>. Closes #<issue-nr>.`

   - the commit adding a new feature must have a message

     `feat: <description>. Closes #<issue-nr>.`
1. Commit changes to test inputs
1. Commit a new baseline

    ```
    npm run commit-baseline
    ```

    > **☛ Note:** If you already staged files for commit using `git add` but didn't `git commit` them yet, then these files will be unstaged using `git reset`. *You won't lose any changes*. Just make sure to check your `git status` and `git add` them again before running a `git commit` afterwards.

1. Push local history
1. Open a *Pull Request* in the origin repository (use dedicated pull requests for different fixes or features)


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

### Directory Structure

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

### Extending the Test Suite

To add a new scenario *foo-test*

1. create a new directory `./input/foo-test`
1. add a new config file `./input/foo-test/glossarify-md.conf.json` (see example below)
1. append a new `test_*` script in `${workspace}/test/package.json`

   ```
   npx . --config=./input/foo-test/glossarify-md.conf.json
   ```

A test case is usually consists of

1. **one or more *document* files...**

   ...with term usages in sentences that specify the test case and acceptance criteria in a `GIVEN <condition> [AND|OR <condition>] THEN <expectation> [AND|OR <expectation>]` syntax

1. **one or more *glossary* files ...**

   ...with term definitions required for the test goal

1. **a *config* file**...

   ...whose `glossaries` section points to the glossary file(s)

> Convention
>
> Each bugfix or feature should have its distinct glossary and document input files



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

Should you need to analyse your implementation avoid changing the test suite for the sake of the analysis. Instead set up a *debug* folder and a configuration as follows:

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
