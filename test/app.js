"use strict";

console.log('process.env', process.env);

var express = require('express');
var app = express();


app.listen(5000, function () {
    console.log('5000');
});