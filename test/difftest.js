import fs from "node:fs";
import path from "node:path";
import proc from "node:process";

let hasDiff = false;
proc.stdin.setEncoding("utf8");
proc.stdin.on("readable", () => {
    let chunk;
    // Use a loop to make sure we read all available data.
    while ((chunk = proc.stdin.read()) !== null) {
        proc.stdout.write(chunk);
        hasDiff = true;
    }
});

proc.stdin.on("end", () => {
    let hasMessage = "";
    if (!fs.existsSync(path.resolve(proc.cwd(), "./output-actual"))) {
        hasMessage += "No directory './output-actual'\n";
    }

    if (!fs.existsSync(path.resolve(proc.cwd(), "./output-expected"))) {
        hasMessage += "No directory './output-expected'\n";
    }

    if (hasDiff || hasMessage) {
        proc.stdout.write(`${hasMessage}
┌──────────────────────────────────────────────────────────────────────────┐
│ TESTS FAILED: Actual output (green*) does not match expected             │
│ output (red). Please review the diff before committing.                  │
│                                                                          │
│ * Some diffs may not be colored.                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ If 'output-actual' is what you want to become the new expected           │
│ baseline, then proceed as follows:                                       │
│                                                                          │
│ 1. Review the diff carefully!                                            │
│ 2. (Linux/Mac): 'npm run new-baseline' (uses 'rm' and 'mv')              │
│ 2. (Windows): remove current 'output-expected' (but *DON'T* use git rm)  │
│ 3. (Windows): rename 'output-actual' to 'output-expected'                │
│ 4. 'npm run commit-baseline'                                             │
│                                                                          │
│ If you commit manually with 'git commit' then your commit message        │
│ must include a line  'test: New baseline.'                               │
└──────────────────────────────────────────────────────────────────────────┘
`);
        proc.exit(1);
    } else {
        proc.stdout.write(`
┌──────────────┐
│ TESTS PASSED │
└──────────────┘
`
        );
    }
});
