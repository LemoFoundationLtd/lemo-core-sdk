var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index');
var lemoClient = new LemoClient();
var BigNumber = require('bignumber.js');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

var method = 'gasPrice';

var tests = [{
    result: '0x15f90',
    formattedResult: new BigNumber(90000),
    call: 'lemo_'+ method
}];

describe('lemoClient.lemo', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('property test: ' + index, function () {

                // given
                var provider = new FakeHttpProvider();
                lemoClient.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, []);
                });

                // when
                var result = lemoClient.lemo[method];

                // then
                assert.deepEqual(test.formattedResult, result);
            });
        });
    });
});

