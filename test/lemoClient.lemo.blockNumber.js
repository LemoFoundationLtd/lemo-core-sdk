var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index');
var lemoClient = new LemoClient();
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

var method = 'blockNumber';

var tests = [{
    result: '0xb',
    formattedResult: 11,
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
                assert.strictEqual(test.formattedResult, result);
            });

            it('async get property test: ' + index, function (done) {

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
                lemoClient.lemo.getBlockNumber(function (err, result) {
                    assert.strictEqual(test.formattedResult, result);
                    done();
                });

            });
        });
    });
});

