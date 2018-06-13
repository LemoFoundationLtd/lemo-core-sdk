var chai = require('chai');
var assert = chai.assert;
var errors = require('../lib/lemo_client/errors');

describe('lib/lemo_client/method', function () {
    describe('getCall', function () {

        for(var key in errors) {
            it('should return and error', function () {

                assert.instanceOf(errors[key](), Error);
            });
        }

    });
});

