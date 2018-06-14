var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var LemoClient = require('../lib/lemo-client');
var lemoClient = new LemoClient();


var tests = [{
    properties: [new lemoClient._extend.Property({
        name: 'gasPrice',
        getter: 'lemo_gasPrice',
        outputFormatter: lemoClient._extend.formatters.outputBigNumberFormatter
    })]
},{
    methods: [new lemoClient._extend.Method({
        name: 'getBalance',
        call: 'lemo_getBalance',
        params: 2,
        inputFormatter: [lemoClient._extend.utils.toAddress, lemoClient._extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: lemoClient._extend.formatters.outputBigNumberFormatter
    })]
},{
    property: 'admin',
    properties: [new lemoClient._extend.Property({
        name: 'gasPrice',
        getter: 'lemo_gasPrice',
        outputFormatter: lemoClient._extend.formatters.outputBigNumberFormatter
    })],
    methods: [new lemoClient._extend.Method({
        name: 'getBalance',
        call: 'lemo_getBalance',
        params: 2,
        inputFormatter: [lemoClient._extend.utils.toAddress, lemoClient._extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: lemoClient._extend.formatters.outputBigNumberFormatter
    })]
}];

describe('lemoClient', function () {
    describe('_extend', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                lemoClient._extend(test);


                if(test.properties)
                    test.properties.forEach(function(property){

                        var provider = new FakeHttpProvider();
                        lemoClient.setProvider(provider);
                        provider.injectResult('');
                        provider.injectValidation(function (payload) {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, property.getter);
                        });

                        if(test.property) {
                            assert.isObject(lemoClient[test.property][property.name]);
                            assert.isFunction(lemoClient[test.property]['get'+ property.name.charAt(0).toUpperCase() + property.name.slice(1)]);
                        } else {
                            assert.isObject(lemoClient[property.name]);
                            assert.isFunction(lemoClient['get'+ property.name.charAt(0).toUpperCase() + property.name.slice(1)]);
                        }
                    });

                if(test.methods)
                    test.methods.forEach(function(property){
                        if(test.property)
                            assert.isFunction(lemoClient[test.property][property.name]);
                        else
                            assert.isFunction(lemoClient[property.name]);
                    });

            });
        });
    });
});

