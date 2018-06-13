var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index.js');
var lemoClient = new LemoClient();
var u = require('./helpers/test.utils.js');

describe('lemoClient.net', function() {
    describe('methods', function() {
        u.propertyExists(lemoClient.net, 'listening');
        u.propertyExists(lemoClient.net, 'peerCount');
    });
});
