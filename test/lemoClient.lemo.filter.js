var chai = require('chai');
var LemoClient = require('../index');
var lemoClient = new LemoClient();
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var errors = require('../lib/lemo_client/errors');

var method = 'filter';

var tests = [{
    args: [{
        fromBlock: 0,
        toBlock: 10,
        address: '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'
    }],
    formattedArgs: [{
        fromBlock: '0x0',
        toBlock: '0xa',
        address: '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855',
        topics: []
    }],
    result: '0xf',
    formattedResult: '0xf',
    call: 'lemo_newFilter'
},{
    args: [{
        fromBlock: 'latest',
        toBlock: 'latest',
        address: '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'
    }],
    formattedArgs: [{
        fromBlock: 'latest',
        toBlock: 'latest',
        address: '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855',
        topics: []
    }],
    result: '0xf',
    formattedResult: '0xf',
    call: 'lemo_newFilter'
},{
    args: ['latest'],
    formattedArgs: [],
    result: '0xf',
    formattedResult: '0xf',
    call: 'lemo_newBlockFilter'
},{
    args: ['pending'],
    formattedArgs: [],
    result: '0xf',
    formattedResult: '0xf',
    call: 'lemo_newPendingTransactionFilter'
}];

describe('lemoClient.lemo', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('property test: ' + index, function () {

                // given
               var provider = new FakeHttpProvider();
               lemoClient.reset();
               lemoClient.setProvider(provider);
               provider.injectResult(test.result);
               provider.injectValidation(function (payload) {
                   assert.equal(payload.jsonrpc, '2.0');
                   assert.equal(payload.method, test.call);
                   assert.deepEqual(payload.params, test.formattedArgs);
               });

               // call
               var filter = lemoClient.lemo[method].apply(lemoClient.lemo, test.args);

               // test filter.get
               if(typeof test.args === 'object') {

                   var logs = [{data: '0xb'}, {data: '0x11'}];

                   provider.injectResult(logs);
                   provider.injectValidation(function (payload) {
                       assert.equal(payload.jsonrpc, '2.0');
                       assert.equal(payload.method, 'lemo_getFilterLogs');
                       assert.deepEqual(payload.params, [test.formattedResult]);
                   });

                   // sync should throw an error
                   try {
                       assert.throws(filter.get());
                   } catch(e){
                       assert.instanceOf(e, Error);
                   }

                   // async should get the fake logs
                   filter.get(function(e, res){
                       assert.equal(logs, res);
                       lemoClient.reset();
                       done();
                   });
               }
            });

            it('should call filterCreationErrorCallback on error while filter creation', function () {
                // given
                var provider = new FakeHttpProvider();
                lemoClient.reset();
                lemoClient.setProvider(provider);
                provider.injectError(errors.InvalidConnection());
                // call
                var args = test.args.slice();
                args.push(undefined);
                args.push(function (err) {
                    assert.include(errors, err);
                    done();
                });
                lemoClient.lemo[method].apply(lemoClient.lemo, args);
            })
        });
    });
});

