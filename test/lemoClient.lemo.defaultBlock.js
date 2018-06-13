var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index');
var lemoClient = new LemoClient();

describe('lemoClient.lemo', function () {
    describe('defaultBlock', function () {
        it('should check if defaultBlock is set to proper value', function () {
            assert.equal(lemoClient.lemo.defaultBlock, 'latest');
        });
    });
});

