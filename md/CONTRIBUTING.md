# Contributing

[launch configuration]: ./.vscode/launch.json

## Table of Contents

## Preparing for Contributions

- Make yourself familiar with *[Collaborating with issues and pull requests](https://help.github.com/en/categories/collaborating-with-issues-and-pull-requests)* in the GitHub help, particularly with the *fork and pull* development model
- **[Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repo on GitHub**


## Installing

*Prerequisites*
- [`git`](https://git-scm.com)
- [`node` and `npm`](https://nodejs.org) - we aim to support the last two Node LTS releases ([Maintenance, Active](https://nodejs.org/en/about/releases/)) as well as the latest Non-LTS versions ([Current](https://nodejs.org/en/about/releases/))
- Editor of your choice, e.g. Atom, VSCode, etc.

> **⚠ Important (Windows-Users):** Configure your editor or IDE to use Unix-style line-endings (LF) for this project. Unix-Style-Endings are required at least for *Markdown*, *JS* and *JSON* files.

~~~
git clone https://github.com/<your-name>/glossarify-md
cd glossarify-md
./install-git-hooks.sh  // optional; Run tests prior to pushing.
npm install
cd ./test
npm install
~~~

> **⚠ Important:** Make sure to run `npm test` successfully on a fresh clone before beginning to code. If tests fail (which should not happen but *might* happen due to unforseen platform issues or bugs) consider filing an issue, first, and hold back contributions until the issue can be resolved. DO NOT just ignore it. DO NOT commit new baselines in this case. Otherwise it will corrupt the baseline and while the CI pipeline might now go green any tests have lost their value.


## Experiments

Should you need to try or debug changes to *glossarify-md source code* then never change the test suite for this. Instead set up an *experiment* with a configuration like this:

~~~
${workspace}/
   |- bin
   |- doc
   |- experiment/          <-- create
   |   |- input/
   |   |   |- document.md
   |   |   |- glossary.md
   |   |- output/
   |   |- glossarify-md.conf.json
   |- ...
   `- package.json
~~~

*glossarify-md.conf.json*

~~~json
{
    "$schema": "../conf/v5/schema.json",
    "baseDir": "./input",
    "outDir": "../output"
}
~~~

Then to run the experiment use...

~~~
npm run experiment
~~~

> **☛ Note**: If you need to create files outside the `experiment/` folder, consider using a `*.gitignore.*` filename pattern to exclude it from revision control and accidental commits.

## Debugging

The project includes a VSCode `Debug Experiment` [launch configuration] for debugging [experiments](#experiments) with the internal debugger (`F5` key).

Alternatively

~~~
npm run debug
~~~

starts a debug session *for an experiment* at `127.0.0.1:9229` and allows other debugger frontends to connect to the process. For example you can connect with

- *Chrome Browser* ⇨ URL-Bar: `chrome://inspect`
- *VSCode* ⇨ [Launch Config][launch configuration] `Debug External`
- others

To run a configuration at arbitrary location use

~~~
npm run dconfig ./path/to/glossarify-md.conf.json  (debug session on)
npm run config  ./path/to/glossarify-md.conf.json  (no debug session)
~~~

## Testing

**Any scripts, paths and examples in this section assume you're working in `${workspace}/test`.**

~~~
cd ./test
npm install  (if not done yet)
~~~

*Test directories:*
~~~
${workspace}/
   |- ...
   |- test/
   |   |- input/            <-- test suite
   |   |- output-actual/    <-- actual results from last run
   |   |- output-expected/  <-- currently accepted baseline
   |   |- node_modules      <-- installed test dependencies
   |   `- package.json      <-- test dependencies and scripts
   |- ...
   `- package.json          <-- project dependencies
~~~

### Baseline Testing

Folder `./output-expected` contains the **baseline** which `./output-actual` is compared against (using `git diff`). If there are any differences between the actual results and the expected baseline then tests fail. Adding additional tests requires the baseline to be updated. It *must only* be updated if all the the differences are an expected consequence of the latest modifications to the system under test or test suite.


### Running the Test Suite

~~~
npm test
~~~

> **Note:** The script in `${workspace}/package.json` will run a **linter** prior to running the test suite. The script in `${workspace}/test/package.json` won't run the linter.
>

You can run a single test or selected set of tests with `npm run at [glob-pattern]`. If you only know the test case directory but not the exact run-script `npm run at? [directory|pattern]` might help you.

*Examples:*
~~~
npm run at? export
npm run at test-p10-13
~~~

### Extending the Test Suite
[run-tests]: #running-the-test-suite

A test case usually consists of

1. **one or more *document* files...**
   ...with term usages in sentences that specify the test case and acceptance criteria in a `GIVEN <condition> [AND|OR <condition>] THEN <expectation> [AND|OR <expectation>]` syntax
1. **one or more *glossary* files ...**
   ...with term definitions required for the test goal
1. **a *config* file**...
   ...whose `glossaries` section points to the glossary file(s)

To add a new test case or scenario *foo-test*

1. create a new feature test directory `./input/foo-test`
   ~~~
   mkdir -p ./input/foo-test
   ~~~
1. copy and tailor a config from an existing test.
   **In particular adjust `outDir` and other paths to `output-actual`!**
1. append a new `test_*` script in `${workspace}/test/package.json`
   ~~~
   node . --config=./input/foo-test/glossarify-md.conf.json
   ~~~


> **Important:** Each test case must have a dedicated configuration and input file set. Avoid copying existing tests. If you can't resist, though, make sure to adjust any paths in the config.

*./input/foo-test/glossarify-md.conf.json (sample)*
~~~json
{
    "$schema": "../../../conf/v5/schema.json",
    "baseDir": ".",
    "outDir": "../../output-actual/foo-test",
    "dev": {
        "termsFile": "../../output-actual/foo-test/terms.json"
    }
}
~~~

### Review


After modifying the sources *and* extending the test suite [run the tests][run-tests] again. After adding tests the test suite *is expected to fail* (see [baseline testing](#baseline-testing])).

**Carefully review the diff of failing tests**:

- the diff should be *minimal* and only change what you would *expect to change*
- changes to other files apart from the newly added test input files are signs of unexpected consequences or a *breaking change*.

Tweak the implementation & rerun tests as often as necessary.

**Once the diff is okay...**

1. Run `npm test` from `${workspace}` root or at least run the linter with

   ~~~
   npm run linter
   ~~~

1. Commit changes to JavaScript sources using [conventional commit messages](https://www.conventionalcommits.org/)

    - Bugfixes: `fix: <issue>. Closes #<issue-nr>.`
    - Features: `feat: <description>. Closes #<issue-nr>.`
    - Breaking Changes:
      ~~~
      feat: or fix: ...

      BREAKING CHANGE: <description>
      ~~~

1. Commit changes to the test suite `${workspace}/test/input/*` with a message:

    ~~~
    test: New test cases.
    ~~~

### Update Baseline


Run the complete test suite to build a fresh `./output-actual`

   ~~~
   npm test
   ~~~

**⚠ Warning:** Committing a corrupt baseline can render the test suite useless. Only proceed if you are sure about the contents in `./output-actual` and that the Diff is okay [^why-this].

1. Create a new baseline from `./output-actual` with

    ~~~
    npm run new-baseline      (Linux, Mac, Unix)
    npm run new-baseline-win  (Windows)
    ~~~

    > **☛ Note**: At this point you can still restore the old baseline by running
    > ~~~
    > git checkout ./output-expected
    > ~~~
    >

1. Commit a new baseline

    ~~~
    npm run commit-baseline
    ~~~
    > **☛ Important** Always commit baselines, separately. This allows for restoring a previous baselines using `git reset` or `git revert`.

    > **☛ Note:** If you have already staged files for commit when running the command but didn't `git commit` them yet, then these files will be unstaged temporarily using `git reset`. *You won't lose any changes*. Just check your `git status` and `git add` them again if needed.

1. `git push` changes to a remote branch

   > **☛ Note:** Always use `git revert` to undo commits if you have already `git push`-ed to a remote branch.

1. Open a *Pull Request* in the origin repository (use dedicated pull requests for different fixes or features)

[^why-this]: *This warning is there to raise your care but not to make you feel intimidated. Nothing is broken until a Pull Request makes it into the `master` branch and if things go wrong `git` will be our friend*.
