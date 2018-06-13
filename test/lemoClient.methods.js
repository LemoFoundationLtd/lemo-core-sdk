var LemoClient = require('../index.js');
var lemoClient = new LemoClient();
var u = require('./helpers/test.utils.js');

describe('lemoClient', function() {
    describe('methods', function () {
        u.methodExists(lemoClient, 'sha3');
        u.methodExists(lemoClient, 'toAscii');
        u.methodExists(lemoClient, 'fromAscii');
        u.methodExists(lemoClient, 'toDecimal');
        u.methodExists(lemoClient, 'fromDecimal');
        u.methodExists(lemoClient, 'fromWei');
        u.methodExists(lemoClient, 'toWei');
        u.methodExists(lemoClient, 'toBigNumber');
        u.methodExists(lemoClient, 'isAddress');
        u.methodExists(lemoClient, 'setProvider');
        u.methodExists(lemoClient, 'reset');

        u.propertyExists(lemoClient, 'providers');
        u.propertyExists(lemoClient, 'lemo');
        u.propertyExists(lemoClient, 'db');
        u.propertyExists(lemoClient, 'shh');
    });
});

