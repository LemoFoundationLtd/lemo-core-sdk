var chai = require('chai');
var LemoClient = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'getWork';

var tests = [{
    args: [],
    formattedArgs: [],
    result: true,
    formattedResult: true,
    call: 'lemo_'+ method
}];

testMethod.runTests('lemo', method, tests);

