#!/usr/bin/env node
import {findUpSync} from 'find-up';
import child_process from 'child_process';
import Path from 'path';
import { createRequire } from 'module';

const entrypoint = Path.resolve(process.argv[2]);
if(!process.env.TS_NODE_PROJECT) {
    const found = findUpSync('tsconfig.json', {
        cwd: entrypoint
    });
    if(found) {
        process.env.TS_NODE_PROJECT = found;
    }
}

let loaderPath;
try {
    loaderPath = createRequire(entrypoint).resolve('ts-node/package.json');
} catch {
    loaderPath = require.resolve('ts-node/package.json');
}
loaderPath = Path.resolve(loaderPath, '../esm.mjs');

const suppressWarningsPath = require.resolve('./suppress-warning.js');

const args = [
    ...process.execArgv,
    '--require',
    suppressWarningsPath,
    '--loader',
    loaderPath,
    ...process.argv.slice(2)
];
const result = child_process.spawnSync(process.argv0, args, {
    stdio: 'inherit'
});
process.exitCode = result.status;
