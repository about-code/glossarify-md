const conf = require("../glossarify-md.conf.json");
const fs = require("fs");
const path = require("path");
const process = require("process");

const PASSED = `
+--------------+
| TESTS PASSED |
+--------------+
`
const FAILED = `
+--------------+
| TESTS FAILED |
+--------------+
`

const outDirActual = conf.outDir;
const outDirActualPath = path.resolve(process.cwd(), outDirActual);
const outDirExpected = conf.outDir.replace("actual", "expected");
const outDirExpectedPath = path.resolve(process.cwd(), outDirExpected);
const errors = [];

function Diff(data) {
    this.type = ""; // 'pathDiff' | 'lineDiff'
    this.message = "";
    this.expected = "";
    this.actual = "";
    this.line = -1;
    this.cursor = -1;
    return Object.assign(this, data);
}

function scanPath(basePath) {
    let filenames = ["."];
    let scanResult = new Map();
    do {
        const filenameRel = filenames.shift();
        const filenameAbs = path.resolve(basePath, filenameRel);
        if (fs.statSync(filenameAbs).isDirectory()) {
            try {
                filenames = [
                    ...filenames,
                    ...fs.readdirSync(filenameAbs).map(file => filenameRel + "/" + file)
                ];
            } catch (err) {
                console.error(err);
                process.exit(1);
            }
            scanResult.set(filenameRel, {type: "directory", filename: filenameRel });
        } else {
            scanResult.set(filenameRel, {type: "file", filename: filenameRel });
        }
    } while(filenames[0]);
    return scanResult;
}



function diff() {
    const filesExpected = scanPath(outDirExpectedPath);
    const filesActual = scanPath(outDirActualPath);
    const filesUnion = new Set(filesExpected.keys());

    filesActual.forEach((value, key) => filesUnion.add(key));

    for(file of filesUnion) {
        const fileExpected = filesExpected.get(file);
        const fileActual = filesActual.get(file);

        if (!fileExpected || !fileActual) {
            errors.push(new Diff({
                type: "pathDiff",
                message: `Actual fileset doesn't match expected fileset.`,
                expected: fileExpected || "None",
                actual: fileActual || "missing"
            }));
        } else {
            if (fileExpected.type === "directory") {
                visitDirectory(fileExpected, fileActual);
            } else if (fileExpected.type === "file") {
                visitFile(fileExpected, fileActual);
            }
        }
    }
    if (errors.length > 0) {
        console.error(FAILED);
        console.error(JSON.stringify(errors, null, 4));
        process.exit(1);
    } else {
        console.log(PASSED);
        process.exit(0);
    };
}

function visitDirectory(scanResultExpected, scanResultActual) {
    if (scanResultExpected.type !== scanResultActual.type) {
        errors.push(new Diff({
            type: "pathDiff",
            message: `Expected type was '${scanResultExpected.type}' but got '${scanResultActual.type}'.`,
            expected: scanResultExpected,
            actual: scanResultActual
        }));
    }

    if (scanResultExpected.filename !== scanResultActual.filename) {
        errors.push(new Diff({
            type: "pathDiff",
            message: `Expected directory '${scanResultExpected.filename}' but got '${scanResultActual.filename}'.`,
            expected: scanResultExpected,
            actual: scanResultActual
        }));
    }
}

function visitFile(scanResultExpected, scanResultActual) {
    if (scanResultExpected.type !== scanResultActual.type) {
        errors.push(new Diff({
            type: "pathDiff",
            message: `Expected type was '${scanResultExpected.type}' but got '${scanResultActual.type}'.`,
            expected: scanResultExpected,
            actual: scanResultActual
        }));
    }

    if (scanResultExpected.filename !== scanResultActual.filename) {
        errors.push(new Diff({
            type: "pathDiff",
            message: `Expected file '${scanResultExpected.filename}' but got '${scanResultActual.filename}'.`,
            expected: scanResultExpected,
            actual: scanResultActual
        }));
    }

    return false; // TODO
}

diff();
