var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index.js');
var lemoClient = new LemoClient();
var u = require('./helpers/test.utils.js');

describe('lemoClient.shh', function() {
    describe('methods', function() {
        u.methodExists(lemoClient.shh, 'version');
        u.methodExists(lemoClient.shh, 'info');
        u.methodExists(lemoClient.shh, 'setMaxMessageSize');
        u.methodExists(lemoClient.shh, 'setMinPoW');
        u.methodExists(lemoClient.shh, 'markTrustedPeer');
        u.methodExists(lemoClient.shh, 'newKeyPair');
        u.methodExists(lemoClient.shh, 'addPrivateKey');
        u.methodExists(lemoClient.shh, 'deleteKeyPair');
        u.methodExists(lemoClient.shh, 'hasKeyPair');
        u.methodExists(lemoClient.shh, 'getPublicKey');
        u.methodExists(lemoClient.shh, 'getPrivateKey');
        u.methodExists(lemoClient.shh, 'newSymKey');
        u.methodExists(lemoClient.shh, 'addSymKey');
        u.methodExists(lemoClient.shh, 'generateSymKeyFromPassword');
        u.methodExists(lemoClient.shh, 'hasSymKey');
        u.methodExists(lemoClient.shh, 'getSymKey');
        u.methodExists(lemoClient.shh, 'deleteSymKey');
        u.methodExists(lemoClient.shh, 'newMessageFilter');
        u.methodExists(lemoClient.shh, 'post');

    });
});

