#!/usr/bin/env node

let app = require('../config/application').container;
let program = app.Commander;

program.parse(process.argv);

if (process.argv.length <= 2) {
    program.outputHelp();
}