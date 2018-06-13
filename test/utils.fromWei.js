var assert = require('assert');
var utils = require('../lib/utils/utils.js');

describe('lib/utils/utils', function () {
    describe('fromWei', function () {
        it('should return the correct value', function () {

            assert.equal(utils.fromWei(1000000000000000000, 'wei'),    '1000000000000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'kwei'),   '1000000000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'mwei'),   '1000000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'gwei'),   '1000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'szabo'),  '1000000');
            assert.equal(utils.fromWei(1000000000000000000, 'finney'), '1000');
            assert.equal(utils.fromWei(1000000000000000000, 'lemo'),  '1');
            assert.equal(utils.fromWei(1000000000000000000, 'klemo'), '0.001');
            assert.equal(utils.fromWei(1000000000000000000, 'grand'),  '0.001');
            assert.equal(utils.fromWei(1000000000000000000, 'mlemo'), '0.000001');
            assert.equal(utils.fromWei(1000000000000000000, 'glemo'), '0.000000001');
            assert.equal(utils.fromWei(1000000000000000000, 'tlemo'), '0.000000000001');
        });
    });
});
