var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index.js');
var lemoClient = new LemoClient();
var u = require('./helpers/test.utils.js');

describe('lemoClient.personal', function() {
    describe('methods', function() {
        u.propertyExists(lemoClient.personal, 'listAccounts');
        u.methodExists(lemoClient.personal, 'newAccount');
        u.methodExists(lemoClient.personal, 'unlockAccount');
    });
});
