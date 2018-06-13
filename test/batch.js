var chai = require('chai');
var assert = chai.assert;
var LemoClient = require('../index');
var lemoClient = new LemoClient();
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var bn = require('bignumber.js');

describe('lib/lemo_client/batch', function () {
    describe('execute', function () {
        it('should execute batch request', function (done) {

            var provider = new FakeHttpProvider();
            lemoClient.setProvider(provider);
            lemoClient.reset();

            var result = '0x126';
            var result2 = '0x127';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(new bn(result), r);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(new bn(result2), r);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'lemo_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'lemo_getBalance');
                assert.deepEqual(second.params, ['0x0000000000000000000000000000000000000005', 'latest']);
            });

            var batch = lemoClient.createBatch();
            batch.add(lemoClient.lemo.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(lemoClient.lemo.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });

        it('should execute batch request for async properties', function (done) {

            var provider = new FakeHttpProvider();
            lemoClient.setProvider(provider);
            lemoClient.reset();

            var result = [];
            var result2 = '0xb';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.isArray(result, r);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.equal(r, 11);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'lemo_accounts');
                assert.deepEqual(first.params, []);
                assert.equal(second.method, 'net_peerCount');
                assert.deepEqual(second.params, []);
            });

            var batch = lemoClient.createBatch();
            batch.add(lemoClient.lemo.getAccounts.request(callback));
            batch.add(lemoClient.net.getPeerCount.request(callback2));
            batch.execute();
        });

        it('should execute batch request with contract', function (done) {

            var provider = new FakeHttpProvider();
            lemoClient.setProvider(provider);
            lemoClient.reset();

            var abi = [{
                "name": "balance(address)",
                "type": "function",
                "inputs": [{
                    "name": "who",
                    "type": "address"
                }],
                "constant": true,
                "outputs": [{
                    "name": "value",
                    "type": "uint256"
                }]
            }];


            var address = '0x1000000000000000000000000000000000000001';
            var result = '0x126';
            var result2 = '0x0000000000000000000000000000000000000000000000000000000000000123';

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(new bn(result), r);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(new bn(result2), r);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'lemo_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'lemo_call');
                assert.deepEqual(second.params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                }]);
            });

            var batch = lemoClient.createBatch();
            batch.add(lemoClient.lemo.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(lemoClient.lemo.contract(abi).at(address).balance.request(address, callback2));
            provider.injectBatchResults([result, result2]);
            batch.execute();
        });

        it('should execute batch requests and receive errors', function (done) {

            var provider = new FakeHttpProvider();
            lemoClient.setProvider(provider);
            lemoClient.reset();

            var abi = [{
                "name": "balance(address)",
                "type": "function",
                "inputs": [{
                    "name": "who",
                    "type": "address"
                }],
                "constant": true,
                "outputs": [{
                    "name": "value",
                    "type": "uint256"
                }]
            }];


            var address = '0x1000000000000000000000000000000000000001';
            var result = 'Something went wrong';
            var result2 = 'Something went wrong 2';


            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.isNotNull(err);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.isNotNull(err);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'lemo_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'lemo_call');
                assert.deepEqual(second.params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                }]);
            });

            var batch = lemoClient.createBatch();
            batch.add(lemoClient.lemo.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(lemoClient.lemo.contract(abi).at(address).balance.request(address, callback2));
            provider.injectBatchResults([result, result2], true); // injects error
            batch.execute();
        });
    });
});

