#!/usr/bin/env node

"use strict";

var app = require('../config/application').container;
var program = app.Commander;

program.parse(process.argv);

if (process.argv.length <= 2) {
    program.outputHelp();
}