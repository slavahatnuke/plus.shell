#!/usr/bin/env node

var program = require('commander');
program.version(require('../package.json').version);

function next(err) {
    if (err) {
        console.log('[ERROR]', err, err.stack);
        return process.exit(1)
    }
    process.exit(0);
}

program
    .command('start', 'Start server')
    .action(function () {
        console.log('Hello');
        next();
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}