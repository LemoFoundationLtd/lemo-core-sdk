import {assert} from 'chai'
import Api from '../lib/api'
import errors from '../lib/errors';
import Signer from '../lib/tx/signer';

describe('Api_new', () => {
    const testRequester = {
        send: () => {
        },
    }

    it('correct config', () => {
        new Api({name: 'func', call: () => 1}, testRequester)
    })
    it('empty config', () => {
        assert.throws(() => {
            new Api(undefined, testRequester)
        }, errors.InvalidAPIDefinition(undefined))
    })
    it('no name', () => {
        assert.throws(() => {
            new Api({}, testRequester)
        }, errors.InvalidAPIDefinition({}))
    })
    it('both call and value', () => {
        const apiConfig = {
            name: 'func',
            value: 'func value',
            call: () => 1,
        }
        assert.throws(() => {
            new Api(apiConfig, testRequester)
        }, errors.InvalidAPIMethod(apiConfig))
    })
})

describe('Api_attachTo', () => {
    const testRequester = {
        send() {
        },
    }
    const testSigner = new Signer(1)
    const apiHolder = {}

    it('custom value', async () => {
        const apiConfig = {
            name: 'myValue',
            value: 'value 1',
        }
        const api = new Api(apiConfig, testRequester, testSigner)
        api.attachTo(apiHolder)
        const result = apiHolder.myValue
        assert.equal(result, 'value 1')
    })

    it('custom call', async () => {
        const apiConfig = {
            name: 'callMyFunc',
            call(...args) {
                assert.equal(this, api)
                assert.equal(this.requester, testRequester)
                assert.equal(this.signer, testSigner)
                assert.deepEqual(args, [123, {a: '8293'}])
                return 100
            },
        }
        const api = new Api(apiConfig, testRequester, testSigner)
        api.attachTo(apiHolder)
        const result = apiHolder.callMyFunc(123, {a: '8293'})
        assert.equal(result, 100)
    })

    it('custom async call', async () => {
        const apiConfig = {
            name: 'callMyFuncAsync',
            call: () => Promise.resolve(200),
        }
        new Api(apiConfig, testRequester, testSigner).attachTo(apiHolder)
        const result = await apiHolder.callMyFuncAsync()
        assert.equal(result, 200)
    })

    it('attach twice', async () => {
        const apiConfig = {
            name: 'callTwice',
            call: () => Promise.resolve(200),
        }
        new Api(apiConfig, testRequester, testSigner).attachTo(apiHolder)
        assert.throws(() => {
            new Api(apiConfig, testRequester, testSigner).attachTo(apiHolder)
        }, errors.UnavailableAPIName('callTwice'))
    })
})
