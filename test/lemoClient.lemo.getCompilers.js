var chai = require('chai');
var LemoClient = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'getCompilers';


var tests = [{
    args: [],
    formattedArgs: [],
    result: ['solidity'],
    formattedResult: ['solidity'],
    call: 'lemo_'+ method
},{
    args: [],
    formattedArgs: [],
    result: ['solidity'],
    formattedResult: ['solidity'],
    call: 'lemo_'+ method
}];

testMethod.runTests('lemo', method, tests);

