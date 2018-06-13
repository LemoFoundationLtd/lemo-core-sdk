var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index.js');
var lemoClient = new LemoClient();
var u = require('./helpers/test.utils.js');

describe('lemoClient.db', function() {
    describe('methods', function() {
        u.methodExists(lemoClient.db, 'putHex');
        u.methodExists(lemoClient.db, 'getHex');
        u.methodExists(lemoClient.db, 'putString');
        u.methodExists(lemoClient.db, 'getString');
    });
});

