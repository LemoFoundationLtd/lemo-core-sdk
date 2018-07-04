var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index.js');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var provider = new FakeHttpProvider();
var lemoClient = new LemoClient(provider);
var u = require('./helpers/test.utils.js');

describe('lemoClient.lemo', function() {
    describe('methods', function() {
        u.methodExists(lemoClient.lemo, 'getBalance');
        u.methodExists(lemoClient.lemo, 'getStorageAt');
        u.methodExists(lemoClient.lemo, 'getTransactionCount');
        u.methodExists(lemoClient.lemo, 'getCode');
        u.methodExists(lemoClient.lemo, 'sendTransaction');
        u.methodExists(lemoClient.lemo, 'call');
        u.methodExists(lemoClient.lemo, 'getBlock');
        u.methodExists(lemoClient.lemo, 'getTransaction');
        u.methodExists(lemoClient.lemo, 'getCompilers');
        u.methodExists(lemoClient.lemo.compile, 'lll');
        u.methodExists(lemoClient.lemo.compile, 'solidity');
        u.methodExists(lemoClient.lemo.compile, 'serpent');
        u.methodExists(lemoClient.lemo, 'getBlockTransactionCount');
        u.methodExists(lemoClient.lemo, 'filter');
        u.methodExists(lemoClient.lemo, 'contract');

        u.propertyExists(lemoClient.lemo, 'coinbase');
        u.propertyExists(lemoClient.lemo, 'mining');
        u.propertyExists(lemoClient.lemo, 'gasPrice');
        u.propertyExists(lemoClient.lemo, 'accounts');
        u.propertyExists(lemoClient.lemo, 'defaultBlock');
        u.propertyExists(lemoClient.lemo, 'blockNumber');
        u.propertyExists(lemoClient.lemo, 'protocolVersion');
    });
});

