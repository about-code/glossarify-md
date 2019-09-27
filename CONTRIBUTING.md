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

> **⚠ Important:** Make sure to run tests successfully, locally on a fresh clone before you start editing. If tests fail (which should not happen but *might* happen due to unforseen platform issues or bugs) consider filing an issue and hold back contributions until the issue can be fixed. Otherwise leave a note in your pull request, at least. DO NOT commit a new baseline in this case. With a corrupted baseline the CI pipeline may run green when it shouldn't and tests lose their purpose of providing feedback to you and us about your changes.

## Testing

Any scripts and paths below assume you're in `${workspace}/test`
```
cd ./test
```
Then run:
```
npm test
```

> Windows users may use above command with the `git-bash` (being installed with *Git*) or try running `npm run test-win` within `cmd`.

### Basic Workflow

The `test` directory has the following structure:

```
${workspace}/
   |- test/
   |   |- input/            <-- test fixture
   |   |- output-expected/  <-- accepted baseline
   |   |- output-actual/    <-- actual test results
   |   `- package.json      <-- test scripts
   `- package.json          <-- project dependencies
```

1. Running the test suite will create a new folder `./output-actual` with the results of processing the contents in `./input`. Test results are *never* comitted.
1. `./output-expected` is the *baseline* compared against `./output-actual` using `git diff`. If there are any differences then the tests fail. Mind the note above, regarding failures after a fresh clone.

1. extend/update test inputs *and* expected outputs. See also *Extending the Test Suite*

1. implement feature or bugfix
1. run tests against your implementation

    If you followed the guide so far then tests pass, because you described your expected output *before* and now actual outputs match. **This is the ideal world you should strive for**.

    However, new tests may change many things which can be tedious to write (e.g. `terms.json` dumps with terms and metadata extracted by the *terminator*). Then it's more efficient to *review* changes.

    Your practical workflow should be a mix of both, that is, an **expect-and-review workflow**:

    1. make the diff causing tests to fail *minimal* by writing down expected output as much as you can anticipate based on the intent of your change
    1. review remaining diff *carefully* for reasonable and unexpected changes (once or twice)
    1. tweak implementation & rerun tests
    1. if actual output is okay create a new baseline from `./output-actual` with
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

   ...with term usages in sentences that specify the test case and acceptance criteria in a `GIVEN <condition> THEN <expectation> [AND (<expectation>)] [OR (<expectation>)]`
1. **one or more *glossary* files ...**

   ...with term definitions required for the test goal
1. **a glossarify-md.conf.json *config* file**...

   ...where its `glossaries` section points to the glossary file(s)

> Rules of thumb:
>
> - each bugfix or feature should   have its distinct glossary and document input files
> - extend a config if the feature under test has its own config
> - extend `./input/glossarify-md.conf.json` default config if the test cases *doesn't* need a special config
> - add a new config and run tests with a particular config if they are to be run separately/independently. See next section.

#### Running Tests with a particular Configuration

If you need to test with a particular glossarify-md configuration then

1. add a new `./input/features/foo` directory or extend an existing one
1. add a new `./input/features/foo/glossarify-md.conf.json`
1. add a test script in `${workspace}/test/package.json` with the next free `{#nr}`:
   - `"test-{#nr}": "npx . --config=./input/features/foo/glossarify-md.conf.json"`
   - append ` && npm run test-{#nr}` to the `suite` script


*./input/features/foo/glossarify-md.conf.json*
```json
{
    "baseDir": ".",
    "outDir": "../../../output-actual/features/foo`",
    "...": "...additional config...",
    "dev": {
        "termsFile": "../../../output-actual/features/foo/terms.json"
    }
}
```

## Debugging

Below we assume the following directory structure:

```
${workspace}/
    |- test/
    |   |- gitignore.input/      <-- debug inputs
    |   |- gitignore.output/     <-- debug outputs
    |   |- input/
    |   |- output-expected/
    |   |- output-actual/
    |   |- gitignore.conf.json   <-- debug config  (glossarify-md config)
    |   `- package.json
```

### Add a Debug Configuration

1. `cd` into `${workspace}/test`
1. Create a personal `gitignore.input/` folder
1. Create a personal `gitignore.conf.json` and copy sample below
1. Tailor debug config
   1. keep writing to a `*gitignore.*` directory (`outDir`)


*${workspace}/test/gitignore.conf.json*
```
{
    "$schema": "../conf.schema.json",
    "baseDir": "./gitignore.input",
    "outDir": "../gitignore.output",
    "includeFiles": ["."],
    "excludeFiles": [],
    "keepRawFiles": [],
    "glossaries": [
        { "file": "./glossary.md", "termHint": "Ⓓ"}
    ],
    "linking": "relative",
    "ignoreCase": false,
    "dev": {
        "termsFile": "../gitignore.output/terms.json",
        "printInputAst": false,
        "printOutputAst": false
    }
}
```

### Using a Remote Debugger

```
npm run debug
```

starts a remote debug session on `127.0.0.1:9229`. You can then connect with any debugger supporting the remote debugging protocol, e.g.

- *Chrome Browser* ⇨ URL-Bar: `chrome://inspect`
- *Firefox Browser* ⇨ URL-Bar: `about:debugging`
    - or ☰ Menu ⇨ Web Developer Tools ⇨ Remote Debugging (FF69+)
    - or ☰ Menu ⇨ Web Developer Tools ⇨ Connect...
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
                "./test/gitignore.conf.json"
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
