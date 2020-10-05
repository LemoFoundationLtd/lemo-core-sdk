import {assert} from 'chai'
import Api from '../lib/api'
import errors from '../lib/errors';

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
    const chainID = 1
    const apiHolder = {}

    it('custom value', async () => {
        const apiConfig = {
            name: 'myValue',
            value: 'value 1',
        }
        const api = new Api(apiConfig, testRequester, chainID)
        api.attachTo(apiHolder)
        const result = apiHolder.myValue
        assert.strictEqual(result, 'value 1')
    })

    it('custom call', async () => {
        const apiConfig = {
            name: 'callMyFunc',
            call(...args) {
                assert.strictEqual(this, api)
                assert.strictEqual(this.requester, testRequester)
                assert.strictEqual(this.chainID, chainID)
                assert.deepEqual(args, [123, {a: '8293'}])
                return 100
            },
        }
        const api = new Api(apiConfig, {requester: testRequester, chainID})
        api.attachTo(apiHolder)
        const result = apiHolder.callMyFunc(123, {a: '8293'})
        assert.strictEqual(result, 100)
    })

    it('custom async call', async () => {
        const apiConfig = {
            name: 'callMyFuncAsync',
            call: () => Promise.resolve(200),
        }
        new Api(apiConfig, testRequester, chainID).attachTo(apiHolder)
        const result = await apiHolder.callMyFuncAsync()
        assert.strictEqual(result, 200)
    })

    it('attach twice', async () => {
        const apiConfig = {
            name: 'callTwice',
            call: () => Promise.resolve(200),
        }
        new Api(apiConfig, testRequester, chainID).attachTo(apiHolder)
        assert.throws(() => {
            new Api(apiConfig, testRequester, chainID).attachTo(apiHolder)
        }, errors.UnavailableAPIName('callTwice'))
    })
})
