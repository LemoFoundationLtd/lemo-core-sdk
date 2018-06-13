var chai = require('chai');
var utils = require('../lib/utils/utils');
var assert = chai.assert;

describe('lib/utils/utils', function () {
    describe('toWei', function () {
        it('should return the correct value', function () {

            assert.equal(utils.toWei(1, 'wei'),    '1');
            assert.equal(utils.toWei(1, 'kwei'),   '1000');
            assert.equal(utils.toWei(1, 'Kwei'),   '1000');
            assert.equal(utils.toWei(1, 'babbage'),   '1000');
            assert.equal(utils.toWei(1, 'mwei'),   '1000000');
            assert.equal(utils.toWei(1, 'Mwei'),   '1000000');
            assert.equal(utils.toWei(1, 'lovelace'),   '1000000');
            assert.equal(utils.toWei(1, 'gwei'),   '1000000000');
            assert.equal(utils.toWei(1, 'Gwei'),   '1000000000');
            assert.equal(utils.toWei(1, 'shannon'),   '1000000000');
            assert.equal(utils.toWei(1, 'szabo'),  '1000000000000');
            assert.equal(utils.toWei(1, 'finney'), '1000000000000000');
            assert.equal(utils.toWei(1, 'lemo'),  '1000000000000000000');
            assert.equal(utils.toWei(1, 'klemo'), '1000000000000000000000');
            assert.equal(utils.toWei(1, 'grand'),  '1000000000000000000000');
            assert.equal(utils.toWei(1, 'mlemo'), '1000000000000000000000000');
            assert.equal(utils.toWei(1, 'glemo'), '1000000000000000000000000000');
            assert.equal(utils.toWei(1, 'tlemo'), '1000000000000000000000000000000');

            assert.equal(utils.toWei(1, 'kwei'),    utils.toWei(1, 'femtolemo'));
            assert.equal(utils.toWei(1, 'szabo'),   utils.toWei(1, 'microlemo'));
            assert.equal(utils.toWei(1, 'finney'),  utils.toWei(1, 'millilemo'));
            assert.equal(utils.toWei(1, 'milli'),    utils.toWei(1, 'millilemo'));
            assert.equal(utils.toWei(1, 'milli'),    utils.toWei(1000, 'micro'));

            assert.throws(function () {utils.toWei(1, 'wei1');}, Error);
        });
    });
});
