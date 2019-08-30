const process = require("process");
const path = require("path");
const fs = require("fs");

let hasDiff = false;
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    process.stdout.write(chunk);
    hasDiff = true;
  }
});

process.stdin.on('end', () => {
    let hasMessage = "";
    if (!fs.existsSync(path.resolve(process.cwd(), "test/output-actual")))
        hasMessage += "No directory 'test/output-actual'\n";

    if (!fs.existsSync(path.resolve(process.cwd(), "test/output-expected")))
        hasMessage += "No directory 'test/output-expected'\n";

    if (hasDiff || hasMessage) {
        process.stdout.write(`${hasMessage}
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
    } else {
        process.stdout.write(`
┌──────────────┐
│ TESTS PASSED │
└──────────────┘
`
        )
    }
});
