#!/usr/bin/env node
var z = require('./z');

var s = z("please do not hack me".split(" ")).filter(/[^(hack)]/).log();

var n = z(z.range(0, 20)).filter(function (n) {
    return n%2;
}).sort(function (a, b) {return b > a;}).log();

