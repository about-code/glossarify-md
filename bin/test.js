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
┌─────────────────────────────────────────────────────────────────┐
│ TESTS FAILED: Actual output (green*) does not match expected    │
│ output (red). Please review the diff before comitting.          │
│                                                                 │
│ * Some diffs may not be colored.                                │
├─────────────────────────────────────────────────────────────────┤
│ If 'output-actual' is what shall become the new expected        │
│ baseline, then proceed as follows:                              │
│ 1. review the diff carefully!                                   │
│ 2. remove current 'output-expected' (but *not* with git rm)     │
│ 3. rename 'output-actual' to 'output-expected'                  │
│ 4. commit the changes to 'output-expected' with a message       │
│    'test: New baseline.' or use 'npm run commit-baseline'.      │
└─────────────────────────────────────────────────────────────────┘
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
