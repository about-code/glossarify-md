#!/usr/bin/env node
import proc from "node:process";
import { main } from "../lib/cli/main.js";

const cliArgv = proc.argv.slice(2);
main(cliArgv);